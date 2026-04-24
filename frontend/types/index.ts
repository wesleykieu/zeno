export interface Subscription {
  id: string;
  user_id: string;
  sender_email: string;
  sender_name: string;
  unsubscribe_link: string | null;
  unsubscribe_mailto: string | null;
  status: "active" | "unsubscribed" | "pending";
  email_count: number;
  last_email_date: string | null;
  created_at: string;
}

export interface Watcher {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  sender_pattern: string | null;
  is_active: boolean;
  created_at: string;
}

export interface WatcherMatch {
  id: string;
  watcher_id: string;
  user_id: string;
  email_subject: string;
  sender: string;
  received_at: string;
  email_id: string;
  snippet: string | null;
  created_at: string;
  watchers?: { name: string };
}
