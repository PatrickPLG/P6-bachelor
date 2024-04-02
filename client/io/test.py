#!/usr/bin/python
import time
import os
import select

IPC_PIPE = "pipeId"

x = '1'

while True:
    try:
        ioWrite = os.open(IPC_PIPE, os.O_WRONLY)
        print("Pipe B ready")
        break
    except:
        # Wait until Pipe B has been initialized
        pass

try:
    while True:
        x = str(int(x) + 1)
        os.write(ioWrite, x.encode('utf-8'))  # Write to Pipe
        time.sleep(1)
finally:
    print('exited')
    os.remove(IPC_PIPE)
