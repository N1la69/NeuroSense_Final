from collector.serial_reader import stream_eeg
from collector.session_manager import SessionRecorder

USER_ID = "test_user_1"
GAME = "Follow the Animal"

recorder = SessionRecorder(USER_ID, GAME)

try:
    stream_eeg(recorder.on_sample)

except KeyboardInterrupt:
    sid = recorder.close()
    print("Session saved:", sid)
