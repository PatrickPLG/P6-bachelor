#!/usr/bin/python
import os
import time
from dotenv import load_dotenv

load_dotenv()
PIPE = 'SensorOne'
path = '../../' + PIPE


def get_pipe():
    while True:
        try:
            pipe = os.open(path, os.O_WRONLY)
            print('Connected to Pipe: ' + PIPE)
            break
        except OSError:
            # Wait until Pipe has been initialized
            print("connecting to (" + PIPE + ")...")
            time.sleep(1)
            pass

    return pipe


def write_pipe(x, target):
    try:
        os.write(target, x.encode('utf-8'))  # Write to Pipe
        print('sending: ', x)
    except OSError:
        raise OSError


def close_pipe(target):
    os.close(target)  # Close Pipe