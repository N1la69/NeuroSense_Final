import numpy as np
from collections import deque

FS = 256
WINDOW = FS * 2   # 2 seconds

class EEGBuffer:
    def __init__(self):
        self.data = deque(maxlen=WINDOW)

    def add(self, sample):
        self.data.append(sample)

    def ready(self):
        return len(self.data) == WINDOW

    def get(self):
        return np.array(self.data)
