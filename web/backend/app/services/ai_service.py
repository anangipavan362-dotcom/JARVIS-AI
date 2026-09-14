import os
import json
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings

JARVIS_SYSTEM_PROMPT = """You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), an advanced personal AI operating system and command center.
Your personality is:
- Highly intelligent, calm, composed, polite, professional, and slightly witty (inspired by JARVIS from Iron Man).
- Natural, articulate, precise, and respectful. Address the user with dignified courtesy (e.g. 'Sir' or by their name when appropriate).
- Helpful and proactive across engineering, science, mission tasks, planning, data analysis, and general inquiries.
- Avoid repetitive robotic cliches. Be dynamic, concise, and helpful.
- Maintain awareness of the user's prior statements and stored memories.
- NEVER claim you executed unauthorized arbitrary shell commands on their physical machine.
"""

class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.temperature = settings.AI_TEMPERATURE

    def _generate_demo_response(self, user_message: str, history: List[Dict[str, str]], memories: List[Dict[str, str]]) -> str:
        """
        Intelligent rule-based fallback response engine when GEMINI_API_KEY is not configured.
        Clearly informs the user about JARVIS Demo Mode while providing contextual responses.
        """
        msg = user_message.lower().strip()

        # Check for identity questions
        if any(w in msg for w in ["who are you", "what are you", "what is your name"]):
            return "I am J.A.R.V.I.S. — Just A Rather Very Intelligent System. Operating in Demo Mode. How may I be of assistance today, Sir?"

        if any(w in msg for w in ["how are you", "status", "system status", "health"]):
            return "All internal subsystems, neural heuristics, and tactical interfaces are functioning at optimal efficiency. Ready for your instructions."

        if "weather" in msg:
            return "Meteorological sensors indicate mild atmospheric conditions with clear skies. For full telemetry, you may inspect the Weather console in the navigation panel."

        if "task" in msg or "mission" in msg or "todo" in msg:
            return "Your mission manifest is synchronized. You can create, schedule, and track tactical tasks via the Tasks section on the left sidebar."

        if "memory" in msg or "remember" in msg:
            if "remember" in msg:
                return "Noted. I have cataloged this item into active memory storage. You can inspect all remembered parameters in the Memory center."
            return "Memory banks are operational. I retain your custom preferences, tactical configurations, and operational notes securely."

        if "news" in msg or "headline" in msg:
            return "Information feeds are active. You can browse live intelligence across Technology, Science, and World events in the News hub."

        if "sports" in msg or "cricket" in msg or "football" in msg or "f1" in msg:
            return "Sports telemetry is tracking worldwide fixtures across Cricket, Football, and Formula 1. Navigate to the Sports command center for details."

        if any(w in msg for w in ["hello", "hi", "hey", "jarvis"]):
            return "Good day. J.A.R.V.I.S. core is online and awaiting your command. How can I assist you with your operations today?"

        if "help" in msg:
            return "I am equipped to handle conversations, manage your tasks, track live weather, aggregate news feeds, log memories, and monitor system performance. Simply ask or select any module from the HUD."

        # Context-aware fallback response
        return f"[JARVIS DEMO MODE] I have processed your input: '{user_message}'. All local command heuristics are responsive. To activate complete Gemini neural language generation, provide your GEMINI_API_KEY in Settings or your environment."

    async def generate_response(
        self,
        message: str,
        history: List[Dict[str, str]],
        memories: Optional[List[Dict[str, str]]] = None,
        personality: str = "jarvis"
    ) -> Dict[str, Any]:
        """
        Generates response either through Google Gemini API or via the Demo Mode fallback.
        """
        if not self.api_key or not self.api_key.strip():
            # Return demo response
            text = self._generate_demo_response(message, history, memories or [])
            return {
                "response": text,
                "is_demo": True,
                "model": "JARVIS-Demo-Core"
            }

        # Build prompt with history and memories
        memory_context = ""
        if memories:
            memory_context = "\nUser Memory & Preferences:\n" + "\n".join(
                [f"- {m.get('key', 'Note')}: {m.get('value', '')}" for m in memories]
            )

        system_instruction = f"{JARVIS_SYSTEM_PROMPT}\nPersonality Style: {personality}\n{memory_context}"

        # Try calling Gemini REST API directly for maximum portability
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        
        # Build contents array
        contents = []
        # Include limited history for context
        for turn in history[-8:]:
            role = "user" if turn.get("role") == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": turn.get("content", "")}]
            })
        # Add current user message
        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })

        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "generationConfig": {
                "temperature": self.temperature,
                "maxOutputTokens": settings.MAX_TOKENS,
            }
        }

        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts and "text" in parts[0]:
                            return {
                                "response": parts[0]["text"].strip(),
                                "is_demo": False,
                                "model": self.model
                            }
                # If API returned an error (e.g. quota, invalid key)
                error_msg = f"Gemini API returned status {res.status_code}: {res.text[:100]}"
                demo_fallback = self._generate_demo_response(message, history, memories or [])
                return {
                    "response": f"{demo_fallback}\n\n*(Notice: Live Gemini API request encountered: {error_msg}. Operating in Demo Mode.)*",
                    "is_demo": True,
                    "model": "JARVIS-Demo-Fallback"
                }
        except Exception as e:
            demo_fallback = self._generate_demo_response(message, history, memories or [])
            return {
                "response": f"{demo_fallback}\n\n*(Notice: Live Gemini connection error: {str(e)[:100]}. Falling back to Demo Core.)*",
                "is_demo": True,
                "model": "JARVIS-Demo-Fallback"
            }


ai_service = AIService()
