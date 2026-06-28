"""
cascadeflow.py — simulated cascadeflow runtime intelligence layer.

Real cascadeflow performs cost-aware model routing across a cascade of models
(fast/cheap -> slow/accurate) based on task complexity. Here we simulate that
decision process deterministically so the AI Runtime Monitor page can show
real routing decisions, costs and savings without requiring paid model access.
"""
from dataclasses import dataclass

# Simulated cost table ($ per request, illustrative only)
FAST_MODEL = "cascade-fast (Haiku-class)"
ADVANCED_MODEL = "cascade-advanced (Sonnet-class)"

FAST_COST = 0.0006
ADVANCED_COST = 0.006


@dataclass
class RoutingDecision:
    model: str
    reason: str
    cost: float
    cost_saved: float


# Task -> base complexity. Higher complexity routes to the advanced model.
TASK_COMPLEXITY = {
    "language_detection": "low",
    "translation": "low",
    "sentiment_analysis": "low",
    "problem_extraction": "medium",
    "memory_lookup": "low",
    "recommendation": "high",
}

TASK_REASON = {
    "language_detection": "Simple lexical pattern match",
    "translation": "Short text, template-based mapping",
    "sentiment_analysis": "Simple classification task",
    "problem_extraction": "Structured extraction, moderate reasoning",
    "memory_lookup": "Deterministic DB aggregation, no reasoning needed",
    "recommendation": "Requires deeper reasoning to craft business-actionable advice",
}


def route(task: str) -> RoutingDecision:
    """Decide which model tier handles `task`, mimicking cascadeflow's
    complexity-aware router. Returns the decision plus cost/savings so the
    runtime monitor can show that cheap tasks are NOT sent to the expensive
    model (cost optimization)."""
    complexity = TASK_COMPLEXITY.get(task, "medium")
    reason = TASK_REASON.get(task, "General purpose task")

    if complexity == "high":
        model = ADVANCED_MODEL
        cost = ADVANCED_COST
        cost_saved = 0.0
    else:
        model = FAST_MODEL
        cost = FAST_COST
        # money saved vs. naively sending every task to the advanced model
        cost_saved = ADVANCED_COST - FAST_COST

    return RoutingDecision(model=model, reason=reason, cost=cost, cost_saved=cost_saved)
