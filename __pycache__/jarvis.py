import tkinter as tk
from PIL import Image, ImageTk
import speech_recognition as sr
import pyttsx3
import threading
import webbrowser
from datetime import datetime

# ---------------------------
# WINDOW
# ---------------------------
window = tk.Tk()
window.title("JARVIS AI")
window.geometry("1200x800")
window.configure(bg="black")

# ---------------------------
# SPEECH ENGINE
# ---------------------------
engine = pyttsx3.init()
engine.setProperty("rate", 160)
engine.setProperty("volume", 1)

# ---------------------------
# TOP TITLE
# ---------------------------
title = tk.Label(
    window,
    text="JARVIS ARTIFICIAL INTELLIGENCE SYSTEM",
    fg="cyan",
    bg="black",
    font=("Consolas", 22, "bold")
)
title.pack(pady=10)

# ---------------------------
# MAIN FRAME
# ---------------------------
main_frame = tk.Frame(window, bg="black")
main_frame.pack(fill="both", expand=True)

# ---------------------------
# LEFT PANEL
# ---------------------------
left_panel = tk.Frame(main_frame, bg="black", width=200)
left_panel.pack(side="left", fill="y")

tk.Label(
    left_panel,
    text="SYSTEM STATUS",
    fg="cyan",
    bg="black",
    font=("Consolas", 14, "bold")
).pack(pady=10)

system_info = tk.Label(
    left_panel,
    text="""
CPU : ONLINE
MIC : ACTIVE
AI  : READY
NET : CONNECTED
VOICE : ACTIVE
""",
    fg="lime",
    bg="black",
    justify="left",
    font=("Consolas", 12)
)
system_info.pack()

# ---------------------------
# CENTER PANEL
# ---------------------------
center_panel = tk.Frame(main_frame, bg="black")
center_panel.pack(side="left", expand=True)

# LOAD IMAGE
img = Image.open("jarvis.png")
img = img.resize((500, 500))

photo = ImageTk.PhotoImage(img)

avatar = tk.Label(
    center_panel,
    image=photo,
    bg="black"
)
avatar.pack()

status_label = tk.Label(
    center_panel,
    text="SYSTEM READY",
    fg="lime",
    bg="black",
    font=("Consolas", 16, "bold")
)
status_label.pack(pady=10)

command_label = tk.Label(
    center_panel,
    text="Waiting...",
    fg="white",
    bg="black",
    font=("Consolas", 14)
)
command_label.pack()

# ---------------------------
# RIGHT PANEL
# ---------------------------
right_panel = tk.Frame(main_frame, bg="black", width=300)
right_panel.pack(side="right", fill="y")

tk.Label(
    right_panel,
    text="COMMAND LOG",
    fg="cyan",
    bg="black",
    font=("Consolas", 14, "bold")
).pack(pady=10)

log_box = tk.Text(
    right_panel,
    width=35,
    height=25,
    bg="black",
    fg="white",
    insertbackground="white"
)
log_box.pack()

# ---------------------------
# SPEAK
# ---------------------------
def speak(text):

    status_label.config(text="SPEAKING...")
    log_box.insert("end", f"Jarvis: {text}\n")
    log_box.see("end")

    engine.say(text)
    engine.runAndWait()

    status_label.config(text="READY")

# ---------------------------
# COMMANDS
# ---------------------------
def process_command(command):

    command_label.config(text=f"You: {command}")

    log_box.insert("end", f"You: {command}\n")
    log_box.see("end")

    if "exit" in command:
        speak("Goodbye Sir")
        window.destroy()

    elif command.startswith("search"):

        query = command.replace("search", "").strip()

        if query:
            speak(f"Searching {query}")

            webbrowser.open(
                f"https://www.google.com/search?q={query}"
            )

    elif "hello" in command:
        speak("Hello Sir. How can I help you?")

    elif "time" in command:

        current_time = datetime.now().strftime("%I:%M %p")

        speak(f"The time is {current_time}")

    else:
        speak(f"You said {command}")

# ---------------------------
# LISTEN
# ---------------------------
recognizer = sr.Recognizer()

def listen():

    while True:

        try:

            status_label.config(text="LISTENING...")

            with sr.Microphone() as source:

                recognizer.adjust_for_ambient_noise(
                    source,
                    duration=1
                )

                audio = recognizer.listen(source)

            command = recognizer.recognize_google(audio)

            process_command(command.lower())

        except Exception as e:

            status_label.config(text="READY")
            print(e)

# ---------------------------
# START
# ---------------------------
def start_jarvis():

    speak("Hello Sir. I am Jarvis.")

    listen()

threading.Thread(
    target=start_jarvis,
    daemon=True
).start()

window.mainloop()
