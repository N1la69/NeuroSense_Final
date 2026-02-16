import threading
from collector.session_manager import SessionRecorder
from collector.serial_reader import start_stream, stop_stream
from server.recommendation_service import generate_recommendation

# GLOBAL STATE
current_recorder = None
lock = threading.Lock()

live_features = {}
running = False


def _callback(sample):

    global current_recorder, live_features

    recorder = current_recorder

    if recorder is None:
        return

    recorder.on_sample(sample)

    if recorder.feature_cache:
        live_features = recorder.feature_cache[-1]


def start_session(user_id, game):

    global current_recorder, running

    with lock:

        if current_recorder is not None:
            return {"error": "Session already running"}

        recorder = SessionRecorder(user_id, game)

        current_recorder = recorder
        running = True

        start_stream(_callback)

        return {
            "sessionId": recorder.session_id,
            "status": "started"
        }


def stop_session():

    global current_recorder, running

    # ATOMIC LOCK
    with lock:

        recorder = current_recorder

        # Already stopped
        if recorder is None:
            print("[STOP] Already stopped")
            return {"status": "already stopped"}

        # CLEAR STATE IMMEDIATELY
        current_recorder = None
        running = False

    # Stop stream outside lock
    try:
        stop_stream()
    except Exception as e:
        print("[STREAM STOP ERROR]", e)

    # Close recorder safely
    try:
        sid = recorder.close()
        userId = recorder.user_id
    except Exception as e:
        print("[RECORDER CLOSE ERROR]", e)
        return {"error": "close failed"}

    # Generate recommendation
    try:
        generate_recommendation(userId, sid)
        print(f"[RECOMMEND] Generated for {userId}")
    except Exception as e:
        print("[RECOMMEND ERROR]", e)

    return {"sessionId": sid}


def get_live():

    if not running:
        return {"error": "No active session"}

    return live_features
