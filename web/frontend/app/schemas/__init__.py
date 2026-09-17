import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ============================================================
# AUTH & USER SCHEMAS
# ============================================================

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    avatar_url: Optional[str] = None


class UserLogin(BaseModel):
    username_or_email: str
    password: str


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    avatar_url: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime.datetime
    last_login: Optional[datetime.datetime] = None


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    email: Optional[EmailStr] = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class SessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    device_info: Optional[str] = None
    browser: Optional[str] = None
    operating_system: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime.datetime
    last_active: datetime.datetime
    is_active: bool
    is_current: bool = False


# ============================================================
# USER SETTINGS SCHEMAS
# ============================================================

class UserSettingsBase(BaseModel):
    theme: str = "jarvis_dark"
    hud_intensity: str = "high"
    animation_intensity: str = "normal"
    glow_intensity: str = "high"
    compact_mode: bool = False
    sound_enabled: bool = True
    voice_enabled: bool = True
    voice_name: str = "default"
    voice_speed: float = 1.0
    voice_volume: float = 1.0
    ai_personality: str = "jarvis"
    response_length: str = "adaptive"
    ai_model: str = "gemini-2.5-flash"
    notify_news: bool = True
    notify_sports: bool = True
    notify_tasks: bool = True
    notify_system: bool = True
    history_retention: bool = True


class UserSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    hud_intensity: Optional[str] = None
    animation_intensity: Optional[str] = None
    glow_intensity: Optional[str] = None
    compact_mode: Optional[bool] = None
    sound_enabled: Optional[bool] = None
    voice_enabled: Optional[bool] = None
    voice_name: Optional[str] = None
    voice_speed: Optional[float] = None
    voice_volume: Optional[float] = None
    ai_personality: Optional[str] = None
    response_length: Optional[str] = None
    ai_model: Optional[str] = None
    notify_news: Optional[bool] = None
    notify_sports: Optional[bool] = None
    notify_tasks: Optional[bool] = None
    notify_system: Optional[bool] = None
    history_retention: Optional[bool] = None


class UserSettingsOut(UserSettingsBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int


# ============================================================
# CONVERSATIONS & MESSAGES
# ============================================================

class MessageCreate(BaseModel):
    content: str
    role: str = "user"


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime.datetime


class ConversationCreate(BaseModel):
    title: Optional[str] = "New Mission"


class ConversationUpdate(BaseModel):
    title: str


class ConversationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    messages: List[MessageOut] = []


class ConversationSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    message_count: int = 0


# ============================================================
# AI SCHEMAS
# ============================================================

class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    stream: bool = False
    context_window: int = 10


class AIChatResponse(BaseModel):
    response: str
    conversation_id: int
    is_demo: bool = False
    model: str = "gemini-2.5-flash"


class AISummarizeRequest(BaseModel):
    text: str


# ============================================================
# MEMORY SCHEMAS
# ============================================================

class MemoryCreate(BaseModel):
    key: str
    value: str
    category: Optional[str] = "general"


class MemoryUpdate(BaseModel):
    key: Optional[str] = None
    value: Optional[str] = None
    category: Optional[str] = None


class MemoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    key: str
    value: str
    category: str
    created_at: datetime.datetime
    updated_at: datetime.datetime


# ============================================================
# TASK SCHEMAS
# ============================================================

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "MEDIUM"  # LOW, MEDIUM, HIGH, URGENT
    due_date: Optional[datetime.datetime] = None
    category: Optional[str] = "General"


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime.datetime] = None
    category: Optional[str] = None
    completed: Optional[bool] = None


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    priority: str
    due_date: Optional[datetime.datetime] = None
    category: str
    completed: bool
    created_at: datetime.datetime


# ============================================================
# NOTIFICATIONS & ACTIVITY
# ============================================================

class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    message: str
    type: str
    read: bool
    created_at: datetime.datetime


class ActivityLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    action: str
    details: Optional[str] = None
    timestamp: datetime.datetime


# ============================================================
# DASHBOARD PAYLOAD
# ============================================================

class DashboardData(BaseModel):
    ai_status: str
    is_demo: bool
    voice_ready: bool
    network_connected: bool
    database_connected: bool
    recent_conversations: List[ConversationSummary]
    urgent_tasks: List[TaskOut]
    recent_memories: List[MemoryOut]
    unread_notifications_count: int
    system_health_score: int
    user: UserOut
