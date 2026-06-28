import tkinter as tk
import speech_recognition as sr
import pyttsx3
import threading
import webbrowser
from datetime import datetime

# -----------------------------
# WINDOW
# -----------------------------
window = tk.Tk()
window.title("JARVIS AI")
window.geometry("1200x800")
window.configure(bg="black")

# -----------------------------
# SPEECH ENGINE
# -----------------------------
engine = pyttsx3.init()
engine.setProperty("rate", 170)

# -----------------------------
# SPEAK
# -----------------------------
def speak(text):
    status_label.config(text="SPEAKING", fg="orange")

    log_box.insert("end", f"Jarvis: {text}\n")
    log_box.see("end")

    engine.say(text)
    engine.runAndWait()

    status_label.config(text="READY", fg="lime")

# -----------------------------
# CLOCK
# -----------------------------
def update_clock():
    current = datetime.now().strftime("%I:%M:%S %p")
    clock_label.config(text=current)
    window.after(1000, update_clock)

# -----------------------------
# COMMANDS
# -----------------------------
def process_command(command):

    command = command.lower()

    command_label.config(text=f"You: {command}")

    log_box.insert("end", f"You: {command}\n")
    log_box.see("end")

    if "hello" in command:
        speak("Hello Pavan")

    elif "time" in command:
        speak(datetime.now().strftime("%I:%M %p"))

    elif "date" in command:
        speak(datetime.now().strftime("%d %B %Y"))

    elif "youtube" in command:
        speak("Opening YouTube")
        webbrowser.open("https://youtube.com")

    elif "google" in command:
        speak("Opening Google")
        webbrowser.open("https://google.com")

    elif "whatsapp" in command:
        speak("Opening WhatsApp")
        webbrowser.open("https://web.whatsapp.com")

    elif command.startswith("search"):

        query = command.replace("search", "").strip()

        if query:
            speak(f"Searching {query}")

            webbrowser.open(
                f"https://www.google.com/search?q={query}"
            )

    elif "exit" in command:
        speak("Goodbye")
        window.destroy()

    else:
        speak("I heard " + command)

# -----------------------------
# LISTEN LOOP
# -----------------------------
listening = False

def listen_loop():

    recognizer = sr.Recognizer()

    speak("Jarvis online")

    while listening:

        try:

            status_label.config(
                text="LISTENING",
                fg="cyan"
            )

            with sr.Microphone() as source:

                recognizer.adjust_for_ambient_noise(
                    source,
                    duration=1
                )

                audio = recognizer.listen(
                    source,
                    timeout=5,
                    phrase_time_limit=5
                )

            text = recognizer.recognize_google(audio)

            print(text)

            process_command(text)

        except:
            pass

# -----------------------------
# START / STOP
# -----------------------------
def start_jarvis():
    global listening

    if not listening:
        listening = True

        threading.Thread(
            target=listen_loop,
            daemon=True
        ).start()

def stop_jarvis():
    global listening

    listening = False

    status_label.config(
        text="STOPPED",
        fg="red"
    )

# -----------------------------
# TITLE
# -----------------------------
title = tk.Label(
    window,
    text="JARVIS ARTIFICIAL INTELLIGENCE SYSTEM",
    fg="cyan",
    bg="black",
    font=("Consolas", 24, "bold")
)

title.pack(pady=10)

# -----------------------------
# CLOCK
# -----------------------------
clock_label = tk.Label(
    window,
    fg="cyan",
    bg="black",
    font=("Consolas", 20)
)

clock_label.pack()

update_clock()

# -----------------------------
# HUD CANVAS
# -----------------------------
canvas = tk.Canvas(
    window,
    width=500,
    height=400,
    bg="black",
    highlightthickness=0
)

canvas.pack()

canvas.create_oval(
    50, 30, 450, 370,
    outline="cyan",
    width=3
)

canvas.create_oval(
    90, 70, 410, 330,
    outline="#00ffff",
    width=2
)

jarvis_text = canvas.create_text(
    250,
    200,
    text="JARVIS",
    fill="cyan",
    font=("Consolas", 32, "bold")
)

# -----------------------------
# ANIMATION
# -----------------------------
glow = True

def animate_text():
    global glow

    if glow:
        canvas.itemconfig(
            jarvis_text,
            fill="white"
        )
    else:
        canvas.itemconfig(
            jarvis_text,
            fill="cyan"
        )

    glow = not glow

    window.after(
        500,
        animate_text
    )

animate_text()

# -----------------------------
# STATUS
# -----------------------------
status_label = tk.Label(
    window,
    text="READY",
    fg="lime",
    bg="black",
    font=("Consolas", 16, "bold")
)

status_label.pack()

command_label = tk.Label(
    window,
    text="Waiting...",
    fg="white",
    bg="black",
    font=("Consolas", 14)
)

command_label.pack()

# -----------------------------
# LOG BOX
# -----------------------------
log_box = tk.Text(
    window,
    width=90,
    height=10,
    bg="black",
    fg="white",
    insertbackground="white"
)

log_box.pack(pady=10)

# -----------------------------
# BUTTONS
# -----------------------------
button_frame = tk.Frame(
    window,
    bg="black"
)

button_frame.pack()

start_btn = tk.Button(
    button_frame,
    text="START JARVIS",
    command=start_jarvis,
    bg="cyan",
    fg="black",
    font=("Consolas", 12, "bold")
)

start_btn.pack(
    side="left",
    padx=10
)

stop_btn = tk.Button(
    button_frame,
    text="STOP JARVIS",
    command=stop_jarvis,
    bg="red",
    fg="white",
    font=("Consolas", 12, "bold")
)

stop_btn.pack(
    side="left",
    padx=10
)

window.mainloop()
