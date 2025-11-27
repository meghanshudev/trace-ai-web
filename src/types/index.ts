export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
}

export interface Integration {
  provider: string;
  access_token: string;
  refresh_token: string;
  metadata_json: {
    [key: string]: any;
  };
  id: number;
  user_id: number;
  created_at: string;
}

export interface Task {
  title: string;
  description: string;
  due_date: string;
  status: string;
  confidence_score: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  origin_integration_id: number;
  origin_provider: string;
  id: number;
  user_id: number;
  created_at: string;
  timeline_events: any[];
  message_links: any[];
}