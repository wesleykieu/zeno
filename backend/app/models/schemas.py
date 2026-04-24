from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ScanRequest(BaseModel):
    max_results: int = 500


class CheckWatchersRequest(BaseModel):
    since_days: int = 1


class UnsubscribeRequest(BaseModel):
    subscription_id: str


class Subscription(BaseModel):
    id: Optional[str] = None
    user_id: str
    sender_email: str
    sender_name: str
    unsubscribe_link: Optional[str] = None
    unsubscribe_mailto: Optional[str] = None
    status: str = "active"
    email_count: int = 0
    last_email_date: Optional[str] = None
    created_at: Optional[datetime] = None


class WatcherCreate(BaseModel):
    name: str
    keywords: list[str]
    sender_pattern: Optional[str] = None


class Watcher(BaseModel):
    id: Optional[str] = None
    user_id: str
    name: str
    keywords: list[str]
    sender_pattern: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None


class WatcherMatch(BaseModel):
    id: Optional[str] = None
    watcher_id: str
    user_id: str
    email_subject: str
    sender: str
    received_at: str
    email_id: str
    snippet: Optional[str] = None


class WatcherUpdate(BaseModel):
    name: Optional[str] = None
    keywords: Optional[list[str]] = None
    sender_pattern: Optional[str] = None
    is_active: Optional[bool] = None
