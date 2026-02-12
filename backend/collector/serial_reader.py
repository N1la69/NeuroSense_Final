import serial
import threading

PORT = "COM5"
BAUD = 115200

running = False
thread = None


def stream_eeg(callback):

    global running

    ser = serial.Serial(PORT, BAUD, timeout=1)

    print("Connected to COM5 — listening for EEG stream...")

    try:
        while running:
            line = ser.readline()

            if not line:
                continue

            try:
                line = line.decode().strip()

                if "," not in line:
                    continue

                ts, val = line.split(",")

                callback({
                    "timestamp": int(ts),
                    "value": float(val)
                })

            except:
                continue

    finally:
        print("Closing serial...")
        ser.close()
        print("Serial closed.")


def start_stream(callback):

    global running, thread

    running = True

    thread = threading.Thread(
        target=stream_eeg,
        args=(callback,),
        daemon=False   # IMPORTANT
    )

    thread.start()


def stop_stream():

    global running, thread

    running = False

    if thread:
        thread.join()
        thread = None

    print("Stream stopped cleanly.")
