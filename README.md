# BharatVoice AI

Multilingual customer feedback intelligence agent. Users submit product feedback in
one of 10 Indian languages; a five-agent AI pipeline detects language, sentiment, the
core problem, recalls memory of similar past complaints ("Hindsight"), and produces an
actionable recommendation. Every AI step is routed through a cascadeflow-style runtime
that picks the cheapest model tier capable of the task and logs the decision.

## Folder structure

```
bharatvoice-ai/
  backend/        FastAPI app, AI agent pipeline, SQLite DB
  frontend/       React + Vite + Tailwind UI
  README.md
```

`ai-agent` logic lives inside `backend/ai_agents.py` (the 5 agents) and
`backend/cascadeflow.py` (runtime routing) rather than a separate top-level folder,
since the agents are invoked directly by the FastAPI request handlers.

## Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Seed sample data (creates 8 products + demo user + 12 sample feedback entries)
python seed.py

# Run the API
uvicorn main:app --reload --port 8010
```

Backend runs at `http://localhost:8010`. Uses SQLite (`bharatvoice.db`) by default —
copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` to a Postgres
connection string for production (see **Deployment** below).

Demo logins:
- **Customer Portal**: `demo@bharatvoice.ai` / `demo1234`
- **Employee Portal**: Employee ID `EMP1001` / `employee123`

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and proxies `/api/*` to the backend on port 8010.

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create a user account |
| POST | `/login` | Authenticate, returns JWT |
| GET | `/products` | List available products |
| POST | `/products` | Add a custom product |
| POST | `/feedback` | Submit feedback → runs the 5-agent AI pipeline |
| GET | `/feedback/history` | Current user's feedback history |
| GET | `/feedback/{id}` | Single feedback result with AI analysis |
| GET | `/product/insights?product_id=` | Aggregated insights for a product |
| GET | `/ai/runtime` | cascadeflow routing logs, cost & savings |

## The AI pipeline (backend/ai_agents.py)

1. **Language Agent** – detects/confirms input language, translates to English.
2. **Sentiment Agent** – classifies Positive / Negative / Neutral.
3. **Problem Extraction Agent** – extracts problem, category, priority.
4. **Hindsight Memory Agent** – looks up a per-product `MemoryRecord` keyed by problem;
   increments occurrence count so the system can say "reported N times previously."
5. **Recommendation Agent** – generates an actionable suggestion, escalating language
   if the memory agent flags the issue as recurring.

Every agent call is routed through `cascadeflow.route(task)`, which assigns a model
tier (fast vs. advanced) based on task complexity and logs cost/savings to
`RuntimeLog`, visible on the **AI Runtime Monitor** page.

## Demo scenario

1. Login with the demo account (or register a new one).
2. Go to **Give Feedback**, pick "Swiggy", language "Telugu", and enter:
   `Delivery rain time lo late avutundi`
3. The result page shows: detected language, English translation, Negative sentiment,
   problem "Delivery delay", High priority, a Hindsight memory note ("reported N times
   previously"), and an AI recommendation about weather-based delivery planning.
4. Visit **AI Insights** → select Swiggy to see the aggregated top complaints and
   satisfaction score across all seeded + submitted feedback.
5. Visit **Runtime Monitor** to see which model tier handled each agent call and the
   cumulative cost savings from routing simple tasks to the fast model.

## Role-based portals

On first visit, choosing **Login** shows a Role Selection screen — Customer or Employee.
Each role gets its own JWT (`role` claim: `customer` | `employee` | `admin`), its own
route guard (`RequireRole`), and its own UI shell — the Customer Portal keeps the top
navbar; the Employee Portal uses a left sidebar (`/employee/*`).

- **Customer login**: email + password.
- **Employee login**: **Employee ID** + password (not email) — see `User.employee_id`
  in `models.py`. Demo: `EMP1001` / `employee123`.

Mandatory **Feedback Category** (Food, Service, Delivery, Payment, etc., or "Other" with
a custom label) is collected at submission time and flows through the whole pipeline:
it overrides the rule-based category guess in `problem_agent`, is stored on the
Hindsight `MemoryRecord`, and is what category-based employee dashboards group by.

Employee Portal pages: Dashboard, Product Intelligence, Feedback Explorer, Feedback
Synthesizer, AI Recommendation Center, Memory Intelligence, Trend Analytics,
**Category Insights**, **Company Improvement Intelligence** (Strengths vs. Areas
Requiring Improvement, AI-synthesized per category), Runtime Monitor, Executive
Summary, Reports (Excel export via `openpyxl`), Notifications, Settings.

Settings (both portals) use a shared left-nav shell (`SettingsShell.jsx`): Profile,
Language, Notifications, Security, AI Runtime, Account (Change Password)
— plus role-specific sections appended per portal.

## Deployment (Render only)

Both the backend and frontend deploy to Render — backend as a Python web service
(with Postgres + a persistent disk for uploads), frontend as a static site.
[`render.yaml`](render.yaml) is a Blueprint that provisions all three in one go.

### One-time setup

1. Push this repo to GitHub.
2. In the Render dashboard: **New → Blueprint**, point it at this repo. Render reads
   `render.yaml` and creates:
   - `bharatvoice-db` — a free Postgres database
   - `bharatvoice-backend` — the API, with `DATABASE_URL` and a generated
     `JWT_SECRET_KEY` wired in automatically, plus a 1GB persistent disk mounted at
     `/var/data` for uploaded proof photos
   - `bharatvoice-frontend` — the static React build

### The one thing you must verify after first deploy

Render's default public URL is `https://<service-name>.onrender.com`, but if that
name is already taken by someone else, Render silently appends a suffix (e.g.
`bharatvoice-backend-a1b2`). `render.yaml` hardcodes the *expected* URLs into:
- `bharatvoice-frontend`'s `VITE_API_BASE` (must point at the actual backend URL —
  **Vite bakes this into the JS bundle at build time**, so a wrong value here breaks
  every API call until you fix it and trigger a redeploy)
- `bharatvoice-backend`'s `CORS_ORIGINS` (must point at the actual frontend URL)

After the first deploy, open both services in the Render dashboard, confirm their
real URLs match what's in `render.yaml`, and if not, update the env var on the
mismatched service and click **Manual Deploy → Deploy latest commit** to rebuild
with the correct value.

### Seeding demo data (optional)

Open a **Shell** tab on `bharatvoice-backend` and run:
```bash
python seed.py
```
**In production this prints randomly generated demo passwords once** — copy them
immediately, they're not stored anywhere in plaintext and won't be shown again.
Skip this step entirely if you don't want demo accounts/data in your production DB.

Free-tier note: Render's free web services (not static sites) sleep after 15
minutes of inactivity and take ~30–50s to cold-start on the next request.

### Production safety checklist

- [x] `JWT_SECRET_KEY` is environment-provided, not hardcoded (`config.py`).
- [x] `ENV=production` blocks the well-known demo passwords (`demo1234` /
      `employee123`) — `seed.py` generates and prints random ones instead.
- [x] Postgres-ready via `DATABASE_URL` (no code changes needed — just set the env var).
- [x] Proof-photo uploads are capped (`MAX_UPLOAD_BYTES`, default 5MB) and
      content-type checked.
- [x] `CORS_ORIGINS` restricted to the actual frontend origin (not `*`) in `render.yaml`.
- [x] Uploaded images persist across deploys via Render's mounted disk, not the
      ephemeral container filesystem.
- [ ] Schema changes after go-live currently require a manual migration — there's no
      Alembic setup yet. Don't run destructive `DROP TABLE`/recreate steps against a
      production database with real user data; add Alembic before your first schema
      change post-launch.
- [ ] No automated tests or rate limiting yet — fine for an initial deploy, worth
      adding before real public traffic.
