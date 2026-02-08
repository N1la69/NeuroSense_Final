import serial
import time

PORT = "COM5"
BAUD = 115200

def stream_eeg(callback):

    ser = serial.Serial(PORT, BAUD, timeout=1)

    # Arduino resets when port opens
    time.sleep(2)

    print("Connected to COM5 — listening for EEG stream...")

    while True:
        try:
            line = ser.readline().decode(errors="ignore").strip()

            if not line:
                continue

            # Ignore marker if it appears
            if "START_SESSION" in line:
                print("Marker detected – starting capture")
                continue

            # REAL DATA lines contain comma
            if "," not in line:
                continue

            ts, val = line.split(",")

            callback({
                "timestamp": int(ts),
                "value": float(val)
            })

        except Exception as e:
            print("Parse error:", e)
