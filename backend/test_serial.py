import serial
import time

ser = serial.Serial("COM5", 115200, timeout=1)
time.sleep(2)

print("Reading raw lines...")

while True:
    line = ser.readline()
    print("RAW:", line)
