import threading
from collector.serial_reader import stream_eeg
from collector.session_manager import SessionRecorder

# ----- GLOBAL STATE -----
current_recorder = None
stream_thread = None
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
    global current_recorder, stream_thread, running

    with lock:
        if running:
            return {"error": "Session already running"}

        current_recorder = SessionRecorder(user_id, game)
        running = True

        # Start serial in background thread
        stream_thread = threading.Thread(
            target=stream_eeg,
            args=(_callback,),
            daemon=True
        )

        stream_thread.start()

        return {
            "sessionId": current_recorder.session_id,
            "status": "started"
        }


def stop_session():
    global current_recorder, running

    if current_recorder is None:
        return {"status": "no active session"}

    with lock:
        if not running:
            return {"error": "No active session"}

        sid = current_recorder.close()

        running = False
        current_recorder = None

        return {
            "sessionId": sid,
            "status": "stopped"
        }


def get_live():
    if not running:
        return {"error": "No active session"}

    return live_features
