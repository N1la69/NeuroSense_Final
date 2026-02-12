import threading
from collector.session_manager import SessionRecorder
from collector.serial_reader import start_stream, stop_stream

# ----- GLOBAL STATE -----
current_recorder = None
lock = threading.Lock()

live_features = {}
running = False


def _callback(sample):
    """Called for every EEG sample"""
    global current_recorder, live_features

    if current_recorder:
        current_recorder.on_sample(sample)

        # expose latest features for API
        if current_recorder.feature_cache:
            live_features = current_recorder.feature_cache[-1]


def start_session(user_id, game):

    global current_recorder, running

    with lock:
        if running:
            return {"error": "Session already running"}

        current_recorder = SessionRecorder(user_id, game)
        running = True

        # Use serial_reader lifecycle manager
        start_stream(_callback)

        return {
            "sessionId": current_recorder.session_id,
            "status": "started"
        }


def stop_session():

    global current_recorder, running

    if current_recorder is None:
        return {"status": "no active session"}

    stop_stream()   # <-- ADD THIS

    sid = current_recorder.close()

    current_recorder = None
    running = False

    return {"sessionId": sid}


def get_live():
    if not running:
        return {"error": "No active session"}

    return live_features
