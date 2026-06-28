"""
ai_agents.py — the BharatVoice multi-agent feedback pipeline.

Five agents run in sequence for every piece of submitted feedback:

  1. LanguageAgent       — detects the input language & translates to English
  2. SentimentAgent      — classifies Positive / Negative / Neutral
  3. ProblemAgent        — extracts the core problem, category, priority
  4. HindsightMemoryAgent— recalls/updates long-term memory of this problem
                           for this product ("seen 320 times before")
  5. RecommendationAgent — produces an actionable product suggestion,
                           informed by the memory agent's recall

Each agent's work is routed through cascadeflow.route() so every model call
is logged with which model tier handled it, why, and at what cost — this is
what powers the AI Runtime Monitor page.

NOTE: This is a hackathon-grade simulation. Language detection/translation
use lexical keyword tables instead of a full NLP model so the demo runs
fully offline with no API keys, while still demonstrating the real pipeline
shape that would call out to an LLM in production.
"""
from sqlalchemy.orm import Session
from datetime import datetime

import models
import cascadeflow

# --- Agent 1: Language detection & translation -----------------------------

LANGUAGE_KEYWORDS = {
    "Hindi": ["hai", "nahi", "bahut", "kharab", "der", "samay"],
    "Telugu": ["avutundi", "ledu", "chala", "bagundi", "late"],
    "Tamil": ["irukku", "illai", "romba", "nalla"],
    "Kannada": ["ide", "illa", "tumba", "chennagi"],
    "Malayalam": ["und", "illa", "valare", "nannayi"],
    "Marathi": ["aahe", "nahi", "khup", "vait"],
    "Bengali": ["ache", "nei", "khub", "kharap"],
    "Gujarati": ["chhe", "nathi", "khub", "kharab"],
    "Punjabi": ["hai", "nahi", "bahut", "maada"],
}

# Tiny phrase dictionary for demo translation of common complaint patterns.
TRANSLATION_HINTS = {
    "late": "late",
    "rain": "rain",
    "delivery": "delivery",
    "avutundi": "is happening",
    "der": "delay",
    "kharab": "bad",
    "packaging": "packaging",
    "payment": "payment",
    "fail": "failure",
}


def language_agent(text: str, declared_language: str, db: Session, feedback_id: int = None):
    decision = cascadeflow.route("language_detection")
    _log_runtime(db, "Language Detection", decision, feedback_id)

    detected = declared_language  # user-declared language is trusted as primary signal
    lower = text.lower()
    if detected == "English" or not any(w in lower for w in sum(LANGUAGE_KEYWORDS.values(), [])):
        translated = text
    else:
        # Lightweight token-substitution "translation" for demo purposes.
        words = lower.split()
        translated_words = [TRANSLATION_HINTS.get(w.strip(".,!?"), w) for w in words]
        translated = " ".join(translated_words).capitalize()

    t_decision = cascadeflow.route("translation")
    _log_runtime(db, "Translation", t_decision, feedback_id)

    return detected, translated


# --- Agent 2: Sentiment ------------------------------------------------------

NEGATIVE_WORDS = ["slow", "late", "bad", "delay", "fail", "poor", "worst", "kharab", "der",
                  "problem", "issue", "broken", "rude", "cancel", "refund"]
POSITIVE_WORDS = ["good", "great", "fast", "excellent", "love", "amazing", "happy", "bagundi", "nalla"]


def sentiment_agent(translated_text: str, db: Session, feedback_id: int = None) -> str:
    decision = cascadeflow.route("sentiment_analysis")
    _log_runtime(db, "Sentiment Analysis", decision, feedback_id)

    lower = translated_text.lower()
    neg = sum(1 for w in NEGATIVE_WORDS if w in lower)
    pos = sum(1 for w in POSITIVE_WORDS if w in lower)

    if neg > pos:
        return "Negative"
    if pos > neg:
        return "Positive"
    return "Neutral"


# --- Agent 3: Problem extraction --------------------------------------------

PROBLEM_RULES = [
    # Ordered most-specific-first so generic words (e.g. "fail", "service") in one
    # rule don't shadow a more specific rule later in the list.
    (["delivery", "late", "delay", "rain"], "Delivery delay", "Delivery", "High"),
    (["packaging", "package", "damaged"], "Packaging quality", "Logistics", "Medium"),
    (["support", "rude", "customer care", "unhelpful"], "Poor customer support", "Support", "Medium"),
    (["login", "authentication", "otp", "password"], "Login/Authentication failure", "Account", "High"),
    (["app crash", "crash", "app bug", "slow app"], "App performance issue", "Technical", "Medium"),
    (["payment", "transaction failed", "charged twice", "money deducted"], "Payment failure", "Payments", "High"),
    (["price", "expensive", "charge", "overcharge"], "Pricing concern", "Billing", "Low"),
]


def problem_agent(translated_text: str, db: Session, feedback_id: int = None, customer_category: str = None):
    """Extracts the specific problem + priority via keyword rules. The
    *category* is treated as customer-verified ground truth when supplied
    (mandatory at submission time) — it overrides the rule-based guess,
    since the person who filed the complaint knows the category better than
    a keyword matcher does. The category still flows from here into memory
    matching, trend analytics and recommendation context."""
    decision = cascadeflow.route("problem_extraction")
    _log_runtime(db, "Problem Extraction", decision, feedback_id)

    lower = translated_text.lower()
    for keywords, problem, rule_category, priority in PROBLEM_RULES:
        if any(k in lower for k in keywords):
            return problem, (customer_category or rule_category), priority

    problem = f"{customer_category} issue" if customer_category else "General feedback"
    return problem, (customer_category or "General"), "Low"


# --- Agent 4: Hindsight memory ----------------------------------------------

def hindsight_memory_agent(db: Session, product_id: int, problem: str, category: str, recommendation: str,
                            feedback_id: int = None) -> str:
    """Looks up (and updates) a long-term memory record keyed by product+problem.
    This simulates Hindsight's persistent memory: each new occurrence increments
    a counter so the agent can say 'this has been reported N times before.'
    The customer-selected category is stored alongside so category-based
    employee dashboards can read it directly off the memory record."""
    decision = cascadeflow.route("memory_lookup")
    _log_runtime(db, "Hindsight Memory Lookup", decision, feedback_id)

    record = db.query(models.MemoryRecord).filter(
        models.MemoryRecord.product_id == product_id,
        models.MemoryRecord.problem_key == problem,
    ).first()

    if record:
        record.occurrences += 1
        record.category = category
        record.last_recommendation = recommendation
        record.trend_note = f"Reported {record.occurrences} times for this product."
        record.updated_at = datetime.utcnow()
        note = f"Similar issue ('{problem}') was reported {record.occurrences} times previously for this product."
    else:
        record = models.MemoryRecord(
            product_id=product_id,
            problem_key=problem,
            category=category,
            occurrences=1,
            last_recommendation=recommendation,
            trend_note="First time this issue has been reported.",
        )
        db.add(record)
        note = f"This is the first reported occurrence of '{problem}' for this product."

    db.commit()
    return note


# --- Agent 5: Recommendation -------------------------------------------------

RECOMMENDATION_TEMPLATES = {
    "Delivery delay": "Use weather-based delivery prediction and increase delivery partner allocation during heavy rainfall or peak hours.",
    "Packaging quality": "Upgrade packaging materials and add quality checks before dispatch to reduce damage in transit.",
    "Payment failure": "Improve payment retry logic and add fallback payment gateways to reduce failed transactions.",
    "Login/Authentication failure": "Strengthen OTP delivery reliability and add alternate authentication options (biometric/email).",
    "App performance issue": "Profile and optimize app performance on low-end devices; add crash analytics for faster fixes.",
    "Poor customer support": "Provide additional agent training and reduce average support response time via better ticket routing.",
    "Pricing concern": "Introduce transparent pricing breakdowns and loyalty-based discounts to address perceived overcharging.",
    "General feedback": "Continue monitoring this feedback category and aggregate similar reports before prioritizing action.",
}


def recommendation_agent(problem: str, memory_note: str, db: Session, feedback_id: int = None) -> str:
    decision = cascadeflow.route("recommendation")
    _log_runtime(db, "Recommendation Generation", decision, feedback_id)

    base = RECOMMENDATION_TEMPLATES.get(problem, RECOMMENDATION_TEMPLATES["General feedback"])
    if "previously" in memory_note and "first" not in memory_note.lower():
        base += " This is a recurring issue — prioritize it in the next sprint."
    return base


# --- Orchestrator -------------------------------------------------------------

def run_pipeline(db: Session, text: str, declared_language: str, product_id: int, customer_category: str = None):
    """Runs all five agents in sequence and returns a result dict.
    The feedback row must already exist for runtime logs to link to it, so
    callers create the row first, then call this with the row's id."""
    detected_language, translated = language_agent(text, declared_language, db)
    sentiment = sentiment_agent(translated, db)
    problem, category, priority = problem_agent(translated, db, customer_category=customer_category)
    return {
        "detected_language": detected_language,
        "translated_text": translated,
        "sentiment": sentiment,
        "problem": problem,
        "category": category,
        "priority": priority,
    }


def _log_runtime(db: Session, task: str, decision: cascadeflow.RoutingDecision, feedback_id):
    log = models.RuntimeLog(
        task=task,
        model=decision.model,
        reason=decision.reason,
        cost=decision.cost,
        cost_saved=decision.cost_saved,
        feedback_id=feedback_id,
    )
    db.add(log)
    db.commit()
