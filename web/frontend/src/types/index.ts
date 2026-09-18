export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'USER' | 'ADMIN';
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'SUSPENDED' | 'DISABLED';
  is_active: boolean;
  created_at: string;
  last_login?: string;
  verified_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
  status?: string;
  email?: string;
}

export interface OTPResponse {
  status: string;
  message: string;
  email?: string;
  expires_in_seconds?: number;
  access_token?: string;
  user?: User;
}

export interface UserSettings {
  id: number;
  user_id: number;
  theme: string;
  hud_intensity: string;
  animation_intensity: string;
  glow_intensity: string;
  compact_mode: boolean;
  sound_enabled: boolean;
  voice_enabled: boolean;
  voice_name: string;
  voice_speed: number;
  voice_volume: number;
  ai_personality: string;
  response_length: string;
  ai_model: string;
  notify_news: boolean;
  notify_sports: boolean;
  notify_tasks: boolean;
  notify_system: boolean;
  history_retention: boolean;
}

export interface ConversationSummary {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  due_date?: string;
  category: string;
  completed: boolean;
  created_at: string;
}

export interface Memory {
  id: number;
  key: string;
  value: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface DashboardData {
  ai_status: string;
  is_demo: boolean;
  voice_ready: boolean;
  network_connected: boolean;
  database_connected: boolean;
  recent_conversations: ConversationSummary[];
  urgent_tasks: Task[];
  recent_memories: Memory[];
  unread_notifications_count: number;
  system_health_score: number;
  user: User;
}

export interface NewsArticle {
  headline: string;
  source: string;
  time: string;
  summary: string;
  url: string;
  category: string;
  is_demo: boolean;
}

export interface SportsEvent {
  title: string;
  tournament: string;
  source: string;
  date: string;
  status: string;
  score: string;
  link: string;
  is_demo: boolean;
}

export interface WeatherData {
  city: string;
  latitude?: number;
  longitude?: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind: number;
  condition: string;
  forecast: {
    date: string;
    max_temp: number;
    min_temp: number;
    condition: string;
  }[];
  is_live: boolean;
}

export interface SystemTelemetry {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  is_demo: boolean;
  uptime_seconds: number;
  platform: string;
  subsystems: {
    ai_core: string;
    database: string;
    api_gateway: string;
    network: string;
    voice_synthesis: string;
    server: string;
  };
  telemetry: {
    db_latency_ms: number;
    memory_usage_mb: number;
    cpu_percent: number;
  };
  chart_data: {
    time: string;
    requests: number;
    responseTime: number;
    errors: number;
  }[];
  recent_activities: {
    id: number;
    action: string;
    details?: string;
    timestamp: string;
  }[];
}

export interface AdminUserDetail {
  user: User;
  conversations_count: number;
  messages_count: number;
  tasks_count: number;
  memories_count: number;
  active_sessions_count: number;
  recent_activities: {
    id: number;
    action: string;
    details?: string;
    timestamp: string;
  }[];
  recent_security_events: {
    id: number;
    event_type: string;
    severity: string;
    ip_address?: string;
    details?: string;
    timestamp: string;
  }[];
}

export interface AdminAnalytics {
  total_users: number;
  verified_users: number;
  pending_users: number;
  suspended_users: number;
  active_sessions: number;
  total_conversations: number;
  total_messages: number;
  total_tasks: number;
  completed_tasks: number;
  security_incidents_count: number;
  registration_timeline: { date: string; registrations: number }[];
  ai_activity_timeline: { date: string; messages: number }[];
}

export interface AuditLog {
  id: number;
  actor_id?: number;
  actor_username?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: string;
  ip_address?: string;
  status: string;
  timestamp: string;
}

export interface SecurityEvent {
  id: number;
  event_type: string;
  severity: string;
  user_id?: number;
  identifier?: string;
  ip_address?: string;
  user_agent?: string;
  details?: string;
  timestamp: string;
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  category: string;
  description?: string;
  updated_at: string;
}
