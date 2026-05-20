export interface Staff {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo?: string;
}

export interface Belief {
  number: number;
  text: string;
  scripture: string;
  reference: string;
}

export interface Value {
  name: string;
  description: string;
  icon: string;
}

export interface Livestream {
  id: string;
  title: string;
  youtube_url: string;
  youtube_live_id: string | null;
  description: string | null;
  is_live: boolean;
  scheduled_at: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  created_at: string;
}

export interface FormSubmission {
  id: string;
  name: string;
  email: string;
  is_read: boolean;
  created_at: string;
  [key: string]: unknown;
}
