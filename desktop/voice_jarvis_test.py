import speech_recognition as sr
import pyttsx3

print("Starting JARVIS voice test...")

# Voice
engine = pyttsx3.init()
engine.setProperty("rate", 160)
engine.setProperty("volume", 1.0)

def speak(text):
    print("JARVIS:", text)
    engine.say(text)
    engine.runAndWait()

# Microphone
recognizer = sr.Recognizer()

try:
    microphone = sr.Microphone()
except Exception as e:
    print("MICROPHONE ERROR:", e)
    input("Press Enter to exit...")
    raise SystemExit

speak("JARVIS online. I am ready.")

print("Adjusting microphone...")

with microphone as source:
    recognizer.adjust_for_ambient_noise(source, duration=0.5)

print()
print("================================")
print("JARVIS IS LISTENING")
print("Say: hello jarvis")
print("================================")
print()

while True:

    try:

        with microphone as source:
            audio = recognizer.listen(
                source,
                timeout=10,
                phrase_time_limit=6
            )

        print("Processing...")

        command = recognizer.recognize_google(audio)

        print("YOU:", command)

        command = command.lower()

        if "hello" in command or "jarvis" in command:

            speak(
                "Hello Pavan. "
                "I can hear you. "
                "JARVIS is working."
            )

        elif "time" in command:

            from datetime import datetime

            current_time = datetime.now().strftime("%I:%M %p")

            speak(
                "The current time is "
                + current_time
            )

        elif "open youtube" in command:

            import webbrowser

            speak("Opening YouTube.")

            webbrowser.open(
                "https://www.youtube.com"
            )

        elif "stop" in command:

            speak("Voice system shutting down.")

            break

        else:

            speak(
                "I heard you say "
                + command
            )

    except sr.WaitTimeoutError:

        print("I didn't hear anything.")

    except sr.UnknownValueError:

        print("I couldn't understand you.")

        speak(
            "Sorry, I did not understand."
        )

    except sr.RequestError as e:

        print(
            "Speech recognition error:",
            e
        )

        speak(
            "The speech recognition service is unavailable."
        )

    except Exception as e:

        print(
            "ERROR:",
            e
        )

        speak(
            "An error occurred."
        )

print("JARVIS stopped.")

input("Press Enter to close...")