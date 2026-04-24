from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import gmail, subscriptions, watchers

app = FastAPI(title="Email Agent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gmail.router, prefix="/api/gmail", tags=["gmail"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["subscriptions"])
app.include_router(watchers.router, prefix="/api/watchers", tags=["watchers"])


@app.get("/health")
def health():
    return {"status": "ok"}
