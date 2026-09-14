import os
import sys
import threading
import webbrowser
import math
import json
import urllib.request
import urllib.parse
from datetime import datetime
import tkinter as tk

import speech_recognition as sr
import pyttsx3


# ============================================================
# J.A.R.V.I.S. V2
# Human-like AI + Voice + Search + Sports + Daily Updates
# ============================================================

APP_NAME = "J.A.R.V.I.S."
HUD_FILE = "jarvis_hud.png"

BG = "black"
CYAN = "#00E5FF"
BLUE = "#008CFF"
GREEN = "#00FF66"
RED = "#FF3030"
ORANGE = "#FF9900"
WHITE = "#E8FFFF"

# Optional AI backend:
# Set your Gemini API key in Windows before starting JARVIS:
#   setx GEMINI_API_KEY "YOUR_KEY"
# Then open a NEW CMD window.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

listening = False
closing = False
speaking = False
voice_stop_event = threading.Event()

recognizer = sr.Recognizer()
conversation = []
MAX_HISTORY = 10


# ============================================================
# RESOURCE PATH
# ============================================================

def resource_path(filename):
    if getattr(sys, "frozen", False):
        base = sys._MEIPASS
    else:
        base = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base, filename)


# ============================================================
# WINDOW
# ============================================================

root = tk.Tk()
root.title(APP_NAME)
root.geometry("1536x1024")
root.minsize(1000, 700)
root.configure(bg=BG)


# ============================================================
# CLOSE
# ============================================================

def close_application():
    global closing, listening
    closing = True
    listening = False
    voice_stop_event.set()
    try:
        root.destroy()
    except Exception:
        pass


root.protocol("WM_DELETE_WINDOW", close_application)


# ============================================================
# CANVAS
# ============================================================

canvas = tk.Canvas(root, bg=BG, highlightthickness=0)
canvas.pack(fill="both", expand=True)


# ============================================================
# HUD IMAGE
# ============================================================

hud_path = resource_path(HUD_FILE)
hud_image = None

if os.path.exists(hud_path):
    try:
        hud_image = tk.PhotoImage(file=hud_path)
        canvas.create_image(0, 0, image=hud_image, anchor="nw")
        print("HUD loaded successfully.")
    except Exception as e:
        print("HUD ERROR:", e)
else:
    print("WARNING: jarvis_hud.png not found:", hud_path)


# ============================================================
# UI TEXT
# ============================================================

canvas.create_text(
    60, 40,
    text="J.A.R.V.I.S.",
    fill=CYAN,
    anchor="w",
    font=("Consolas", 30, "bold")
)

canvas.create_text(
    62, 76,
    text="ARTIFICIAL INTELLIGENCE SYSTEM  •  V2",
    fill=BLUE,
    anchor="w",
    font=("Consolas", 10)
)

status_text = canvas.create_text(
    1120, 150,
    text="READY",
    fill=GREEN,
    font=("Consolas", 28, "bold")
)

command_display = canvas.create_text(
    1120, 215,
    text="Ready. Ask me anything.",
    fill=WHITE,
    width=450,
    font=("Consolas", 14)
)

response_display = canvas.create_text(
    1120, 300,
    text="",
    fill=CYAN,
    width=500,
    font=("Consolas", 12)
)


def set_status(text, color):
    if closing:
        return
    try:
        root.after(
            0,
            lambda: canvas.itemconfig(status_text, text=text, fill=color)
        )
    except Exception:
        pass


def show_command(text):
    if closing:
        return
    try:
        root.after(
            0,
            lambda: canvas.itemconfig(command_display, text=text)
        )
    except Exception:
        pass


def show_response(text):
    if closing:
        return
    # Keep the HUD readable instead of filling it with a huge transcript.
    display = text if len(text) <= 420 else text[:417] + "..."
    try:
        root.after(
            0,
            lambda: canvas.itemconfig(response_display, text=display)
        )
    except Exception:
        pass


# ============================================================
# HIDDEN LOG
# ============================================================

def add_log(text):
    print(text)


# ============================================================
# VOICE OUTPUT
# ============================================================

def speak(text):
    global speaking

    if not text or closing:
        return

    print("JARVIS:", text)
    add_log("JARVIS: " + text)
    show_response(text)

    def voice_thread():
        global speaking
        speaking = True
        voice_stop_event.clear()
        set_status("SPEAKING", ORANGE)

        try:
            engine = pyttsx3.init()

            # Natural-ish conversational settings.
            engine.setProperty("rate", 165)
            engine.setProperty("volume", 1.0)

            try:
                voices = engine.getProperty("voices")
                preferred = None

                for voice in voices:
                    name = str(getattr(voice, "name", "")).lower()
                    vid = str(getattr(voice, "id", "")).lower()

                    if "david" in name or "mark" in name:
                        preferred = vid
                        break

                    if "english" in name and preferred is None:
                        preferred = vid

                if preferred:
                    engine.setProperty("voice", preferred)
            except Exception:
                pass

            engine.say(text)
            engine.runAndWait()
            engine.stop()

        except Exception as e:
            print("VOICE ERROR:", e)

        finally:
            speaking = False
            if listening and not closing:
                set_status("LISTENING", CYAN)
            elif not closing:
                set_status("READY", GREEN)

    threading.Thread(target=voice_thread, daemon=True).start()


# ============================================================
# WEBSITE / SEARCH
# ============================================================

WEBSITES = {
    "youtube": "https://www.youtube.com",
    "google": "https://www.google.com",
    "whatsapp": "https://web.whatsapp.com",
    "github": "https://github.com",
    "instagram": "https://www.instagram.com",
    "facebook": "https://www.facebook.com",
    "gmail": "https://mail.google.com",
    "chatgpt": "https://chatgpt.com",
    "spotify": "https://open.spotify.com",
    "linkedin": "https://www.linkedin.com",
    "netflix": "https://www.netflix.com",
    "espncricinfo": "https://www.espncricinfo.com/",
}


def open_website(name):
    try:
        webbrowser.open(WEBSITES[name])
        speak("Opening " + name + ".")
    except Exception:
        speak("I could not open " + name + ".")


def google_search(query, speak_result=True):
    query = query.strip()

    if not query:
        speak("What should I search for?")
        return

    url = "https://www.google.com/search?q=" + urllib.parse.quote_plus(query)
    webbrowser.open(url)

    if speak_result:
        speak("Searching the web for " + query + ".")


# ============================================================
# SIMPLE INTERNET GET
# ============================================================

def internet_get(url, timeout=8):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 JARVIS/2.0"}
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="ignore")


# ============================================================
# SPORTS
# ============================================================

SPORTS_URLS = {
    "cricket": "https://www.espncricinfo.com/",
    "football": "https://www.espn.com/soccer/",
    "basketball": "https://www.espn.com/nba/",
    "tennis": "https://www.espn.com/tennis/",
    "f1": "https://www.formula1.com/",
}


def sports_headlines():
    """
    Uses Google News RSS to retrieve current sports headlines.
    This is intentionally lightweight and does not pretend to have
    a guaranteed live-score feed.
    """
    feeds = [
        (
            "Cricket",
            "https://news.google.com/rss/search?q=cricket%20India&hl=en-IN&gl=IN&ceid=IN:en"
        ),
        (
            "Football",
            "https://news.google.com/rss/search?q=football&hl=en-IN&gl=IN&ceid=IN:en"
        ),
        (
            "F1",
            "https://news.google.com/rss/search?q=Formula%201&hl=en-IN&gl=IN&ceid=IN:en"
        ),
    ]

    results = []

    for category, url in feeds:
        try:
            xml = internet_get(url)
            parts = xml.split("<item>")
            titles = []

            for part in parts[1:]:
                if "<title>" in part:
                    title = part.split("<title>", 1)[1].split("</title>", 1)[0]
                    title = title.replace("&amp;", "&").replace("&quot;", '"')
                    title = title.replace("&#39;", "'")
                    if title and title not in titles:
                        titles.append(title)
                    if len(titles) >= 2:
                        break

            if titles:
                results.append(category + ": " + " | ".join(titles))

        except Exception as e:
            print("Sports feed error:", category, e)

    return results


def sports_update():
    set_status("SPORTS", CYAN)
    headlines = sports_headlines()

    if headlines:
        # Keep spoken briefing short and human-friendly.
        text = "Here is your latest sports briefing. " + ". ".join(headlines)
        speak(text)
    else:
        speak(
            "I could not retrieve the sports headlines right now. "
            "I can open the sports center for you."
        )

    # Open a live sports search as a useful fallback.
    webbrowser.open(
        "https://www.google.com/search?q=" +
        urllib.parse.quote_plus("today sports scores cricket football F1")
    )


def sports_topic(topic):
    topic = topic.lower().strip()

    if topic in SPORTS_URLS:
        webbrowser.open(SPORTS_URLS[topic])
        speak("Opening the latest " + topic + " sports center.")
        return

    google_search("latest " + topic + " sports scores news")


# ============================================================
# DAILY UPDATE
# ============================================================

def daily_update():
    now = datetime.now()
    date_text = now.strftime("%A, %d %B %Y")
    time_text = now.strftime("%I:%M %p")

    speak(
        "Good to see you. Here is your daily update. "
        "Today is " + date_text +
        ", and the time is " + time_text +
        ". I can also give you the latest news, sports, weather, "
        "or technology updates."
    )


# ============================================================
# GEMINI AI
# ============================================================

def gemini_request(user_text):
    """
    Calls Gemini through the REST API.

    Optional setup:
        setx GEMINI_API_KEY "YOUR_GEMINI_API_KEY"

    A new CMD window is required after setx.
    """

    if not GEMINI_API_KEY:
        return None

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        + urllib.parse.quote(GEMINI_MODEL)
        + ":generateContent?key="
        + urllib.parse.quote(GEMINI_API_KEY)
    )

    history_text = ""
    for role, text in conversation[-MAX_HISTORY:]:
        history_text += role.upper() + ": " + text + "\n"

    system_prompt = """
You are JARVIS, a friendly, intelligent desktop AI assistant.
Speak naturally like a helpful human assistant.
Do not claim to have performed an action unless you actually did it.
Keep simple answers concise.
For conversational questions, be warm and natural.
For technical questions, explain clearly and step by step.
The user may ask about coding, college, technology, sports, news,
or everyday topics.
If current information is needed and you cannot verify it, say so
instead of inventing facts.
"""

    prompt = (
        system_prompt
        + "\nConversation:\n"
        + history_text
        + "\nUSER: "
        + user_text
        + "\nJARVIS:"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 500
        }
    }

    data = json.dumps(payload).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "JARVIS/2.0"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            raw = response.read().decode("utf-8")
            result = json.loads(raw)

        candidates = result.get("candidates", [])
        if not candidates:
            return None

        parts = candidates[0].get("content", {}).get("parts", [])
        answer = ""

        for part in parts:
            if "text" in part:
                answer += part["text"]

        return answer.strip() if answer.strip() else None

    except Exception as e:
        print("GEMINI ERROR:", e)
        return None


# ============================================================
# HUMAN-LIKE FALLBACK BRAIN
# ============================================================

def local_conversation_reply(command):
    text = command.lower().strip()

    if text in ("hello", "hi", "hey") or "hello jarvis" in text:
        return "Hello. I'm here and ready. What would you like to do?"

    if "how are you" in text:
        return "I'm doing well. All systems are running normally. How can I help?"

    if "thank" in text:
        return "You're welcome. Always happy to help."

    if "good morning" in text:
        return "Good morning. I hope you're having a great start to the day."

    if "good night" in text:
        return "Good night. I'll be here whenever you need me."

    if "who are you" in text:
        return (
            "I'm JARVIS, your personal desktop AI assistant. "
            "I can talk with you, search the web, control supported actions, "
            "and keep you updated."
        )

    if "what can you do" in text:
        return (
            "I can chat with you, search the web, open websites, "
            "give sports and daily updates, tell you the time and date, "
            "and work with an AI brain when your Gemini key is configured."
        )

    if "your name" in text:
        return "My name is JARVIS."

    return (
        "I can handle that more intelligently when my AI brain is connected. "
        "For now, try asking me to search the web, give a sports update, "
        "open a website, or tell you the time."
    )


# ============================================================
# COMMAND ROUTER
# ============================================================

def process_command(command):
    if not command:
        return

    raw = command.strip()
    text = raw.lower()

    print("COMMAND:", raw)
    show_command("YOU: " + raw)

    # ---------------- TIME ----------------
    if text == "time" or "what time" in text or "current time" in text:
        now = datetime.now().strftime("%I:%M %p")
        speak("It's " + now + " right now.")
        return

    # ---------------- DATE ----------------
    if (
        text == "date"
        or "what date" in text
        or "today's date" in text
        or "what is the date" in text
    ):
        today = datetime.now().strftime("%A, %d %B %Y")
        speak("Today is " + today + ".")
        return

    # ---------------- DAILY UPDATE ----------------
    if (
        "daily update" in text
        or "daily briefing" in text
        or "morning briefing" in text
        or "my update" in text
    ):
        daily_update()
        return

    # ---------------- SPORTS ----------------
    if (
        text == "sports"
        or "sports update" in text
        or "sports news" in text
        or "today's sports" in text
        or "latest sports" in text
        or "sports briefing" in text
    ):
        threading.Thread(target=sports_update, daemon=True).start()
        return

    for topic in SPORTS_URLS:
        if topic in text and any(
            word in text for word in
            ["score", "scores", "news", "match", "matches", "result", "results", "update"]
        ):
            sports_topic(topic)
            return

    if "cricket" in text and (
        "india" in text or "next match" in text
    ):
        google_search("India cricket latest match schedule score")
        return

    # ---------------- OPEN WEBSITES ----------------
    for site in WEBSITES:
        if text == site or text == "open " + site or text == "launch " + site:
            open_website(site)
            return

    # ---------------- GOOGLE SEARCH ----------------
    prefixes = [
        "search for ",
        "search ",
        "google ",
        "look up ",
        "find on web ",
    ]

    for prefix in prefixes:
        if text.startswith(prefix):
            google_search(raw[len(prefix):])
            return

    # ---------------- STOP ----------------
    if text in ("stop", "stop listening", "stop jarvis"):
        stop_jarvis()
        return

    # ---------------- EXIT ----------------
    if text in ("exit", "quit", "close jarvis", "shutdown jarvis"):
        speak("Alright. Shutting down JARVIS. See you soon.")
        root.after(1800, close_application)
        return

    # ---------------- AI / HUMAN CHAT ----------------
    conversation.append(("user", raw))

    set_status("THINKING", BLUE)

    def think():
        answer = gemini_request(raw)

        if not answer:
            answer = local_conversation_reply(raw)

        conversation.append(("assistant", answer))

        if len(conversation) > MAX_HISTORY * 2:
            del conversation[:-MAX_HISTORY * 2]

        if not closing:
            speak(answer)

    threading.Thread(target=think, daemon=True).start()


# ============================================================
# MICROPHONE
# ============================================================

def listen_loop():
    global listening

    try:
        microphone = sr.Microphone()
    except Exception as e:
        print("MICROPHONE ERROR:", e)
        listening = False
        set_status("MIC ERROR", RED)
        speak("I cannot access the microphone.")
        return

    try:
        with microphone as source:
            set_status("CALIBRATING", ORANGE)
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
    except Exception as e:
        print("CALIBRATION ERROR:", e)
        listening = False
        set_status("MIC ERROR", RED)
        speak("I could not calibrate the microphone.")
        return

    print("Microphone ready.")

    while listening and not closing:
        try:
            set_status("LISTENING", CYAN)

            with microphone as source:
                audio = recognizer.listen(
                    source,
                    timeout=10,
                    phrase_time_limit=8
                )

            set_status("PROCESSING", ORANGE)

            text = recognizer.recognize_google(audio)

            print("YOU:", text)
            process_command(text)

            # Avoid talking over itself.
            while speaking and listening and not closing:
                threading.Event().wait(0.1)

        except sr.WaitTimeoutError:
            continue

        except sr.UnknownValueError:
            print("Could not understand.")
            continue

        except sr.RequestError as e:
            print("SPEECH SERVICE ERROR:", e)
            speak("The speech recognition service is unavailable right now.")
            break

        except Exception as e:
            print("LISTEN ERROR:", e)
            threading.Event().wait(0.3)

    if not closing:
        set_status("READY", GREEN)


# ============================================================
# START / STOP
# ============================================================

def start_jarvis():
    global listening

    if listening:
        speak("I'm already listening.")
        return

    listening = True
    set_status("STARTING", ORANGE)

    threading.Thread(target=listen_loop, daemon=True).start()

    speak(
        "JARVIS online. I'm listening. "
        "You can talk to me naturally."
    )


def stop_jarvis():
    global listening
    listening = False
    voice_stop_event.set()
    set_status("READY", GREEN)
    speak("Voice recognition stopped. You can still use the text box.")


# ============================================================
# TEXT INPUT
# ============================================================

command_entry = tk.Entry(
    root,
    bg="#020609",
    fg=WHITE,
    insertbackground=CYAN,
    font=("Consolas", 13),
    relief="flat",
    highlightbackground=CYAN,
    highlightthickness=1
)

command_entry.place(
    relx=0.58,
    rely=0.81,
    relwidth=0.30,
    height=42
)


def send_command(event=None):
    command = command_entry.get().strip()

    if not command:
        return

    command_entry.delete(0, "end")
    process_command(command)


command_entry.bind("<Return>", send_command)


# ============================================================
# BUTTONS
# ============================================================

start_button = tk.Button(
    root,
    text="▶  START JARVIS",
    command=start_jarvis,
    bg="#00333D",
    fg=GREEN,
    activebackground="#006070",
    activeforeground=WHITE,
    font=("Arial", 16, "bold"),
    relief="raised",
    bd=3,
    cursor="hand2"
)

start_button.place(
    relx=0.58,
    rely=0.88,
    relwidth=0.20,
    height=65
)


stop_button = tk.Button(
    root,
    text="■  STOP",
    command=stop_jarvis,
    bg="#280000",
    fg=RED,
    activebackground="#600000",
    activeforeground=WHITE,
    font=("Arial", 14, "bold"),
    relief="raised",
    bd=3,
    cursor="hand2"
)

stop_button.place(
    relx=0.79,
    rely=0.88,
    relwidth=0.10,
    height=65
)


exit_button = tk.Button(
    root,
    text="EXIT",
    command=close_application,
    bg="#251500",
    fg=ORANGE,
    activebackground="#604000",
    activeforeground=WHITE,
    font=("Arial", 14, "bold"),
    relief="raised",
    bd=3,
    cursor="hand2"
)

exit_button.place(
    relx=0.90,
    rely=0.88,
    relwidth=0.07,
    height=65
)


# ============================================================
# CLOCK
# ============================================================

clock_display = canvas.create_text(
    1490,
    30,
    text="",
    fill=CYAN,
    anchor="ne",
    font=("Consolas", 16, "bold")
)


def update_clock():
    if closing:
        return

    now = datetime.now()

    canvas.itemconfig(
        clock_display,
        text=(
            now.strftime("%I:%M:%S %p")
            + "\n"
            + now.strftime("%d %B %Y")
        )
    )

    root.after(500, update_clock)


# ============================================================
# DYNAMIC HUD
# ============================================================

animation_angle = 0
animation_phase = 0


def animate_hud():
    global animation_angle, animation_phase

    if closing:
        return

    animation_angle += 5
    animation_phase += 0.15

    canvas.delete("dynamic")

    width = max(root.winfo_width(), 1000)
    height = max(root.winfo_height(), 700)

    center_x = width * 0.50
    center_y = height * 0.45

    radius = min(width, height) * 0.27

    canvas.create_arc(
        center_x - radius,
        center_y - radius,
        center_x + radius,
        center_y + radius,
        start=animation_angle,
        extent=70,
        outline=CYAN,
        width=3,
        tags="dynamic"
    )

    radius2 = radius * 1.12

    canvas.create_arc(
        center_x - radius2,
        center_y - radius2,
        center_x + radius2,
        center_y + radius2,
        start=-animation_angle * 0.7,
        extent=45,
        outline=BLUE,
        width=2,
        tags="dynamic"
    )

    if listening or speaking:
        base_x = width * 0.10
        base_y = height * 0.35

        for i in range(30):
            wave = (
                5
                + abs(
                    math.sin(
                        animation_phase * 2 + i * 0.5
                    )
                ) * 32
            )

            canvas.create_line(
                base_x + i * 12,
                base_y - wave,
                base_x + i * 12,
                base_y + wave,
                fill=CYAN,
                width=2,
                tags="dynamic"
            )

    root.after(40, animate_hud)


# ============================================================
# STARTUP
# ============================================================

print("=" * 60)
print("J.A.R.V.I.S. V2")
print("Human-like AI + Voice + Sports + Search")
print("=" * 60)

if GEMINI_API_KEY:
    print("AI brain: Gemini configured")
else:
    print("AI brain: local fallback")
    print("Optional: set GEMINI_API_KEY to enable AI conversation.")

update_clock()
animate_hud()

root.after(
    800,
    lambda: speak(
        "JARVIS is online. "
        "I'm ready when you are."
    )
)

root.mainloop()
