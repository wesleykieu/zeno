# Zeno

An AI-powered email productivity app that cuts through inbox noise and surfaces what actually matters.

## Stack

- **Frontend** — Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend** — FastAPI (Python), Google Gmail API
- **Auth** — NextAuth.js with Google OAuth
- **Database** — Supabase (Postgres)

## Features

- Today's Digest — emails cycled and surfaced by relevance
- Priority inbox with quick actions (reply, snooze, unsubscribe)
- Task list integrated into priority view
- Watchers — tell the AI what to look out for in your inbox
- Schedule widget and quick links to external tools
- Light / dark mode

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A Google Cloud project with Gmail API + OAuth enabled
- A Supabase project

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# fill in .env.local
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# fill in .env
uvicorn app.main:app --reload
```

## Environment Variables

See `frontend/.env.example` and `backend/.env.example` for required variables.
