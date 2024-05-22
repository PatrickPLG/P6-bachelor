#!/usr/bin/python
import json
import os
import time
from dotenv import load_dotenv

load_dotenv()
PIPE = 'SensorOne'

# config
printEveryXSeconds = 3
printDataTransmitted = True

# time since last console print
last_time_printed = time.time()


def print_every_x_seconds(y):
    global printEveryXSeconds
    global last_time_printed
    if time.time() - last_time_printed > printEveryXSeconds:
        last_time_printed = time.time()
        print('\n>> (' + getTimeString() + '): ' + y)


def get_pipe(pipeName=PIPE):
    path = get_path_to_pipe(pipeName)
    while True:
        try:
            pipe = os.open(path, os.O_WRONLY)
            if not printDataTransmitted:
                print('Data transmission print is disabled. Set printDataTransmitted = True in pipe.py to enable.\n')
            print('\n>> (%s) Successfully connected to pipe (%s).' % (getTimeString(), pipeName))

            break
        except OSError:
            # Wait until Pipe has been initialized
            print_every_x_seconds('Waiting for pipe (%s) to be initialized.. ' % pipeName)
            pass
        except KeyboardInterrupt:
            print('Interrupted by keyboard input..\n')
            pass

    return pipe


def write_pipe(x, target):
    global printDataTransmitted
    try:
        os.write(target, x.encode('utf-8'))  # Write to Pipe
        # Pretty print the data being sent
        if printDataTransmitted:
            print_every_x_seconds(json.dumps(json.loads(x), indent=4))
    except OSError:
        print('\n>> (%s): Failed writing pipe.. \n' % getTimeString())
        raise ConnectionError


def getTimeString(showDate=False):
    t = time.time()
    fmt = time.gmtime(t)
    if showDate:
        strf = time.strftime("%D %T", fmt)
    else:
        strf = time.strftime("%T", fmt)

    return strf


def close_pipe(target):
    try:
        os.close(target)  # Close Pipe
        print('\n>> Pipe Closed\n')
    except OSError:
        print('Failed closing pipe..')
        pass


def get_path_to_pipe(pipeName):
    dirname = os.path.dirname(__file__)
    path = '%s/../%s' % (dirname, pipeName)
    return path
