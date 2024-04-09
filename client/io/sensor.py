import sys
import time
import os
import pipe
import json

target = pipe.get_pipe()
x = 0
while True:
    x = x + 1.5

    jsonDict = {
        'key': 'sensor_data',
        'data': {
            "temperature": 25.0 + x * 0.1,
            "humidity": 60.0 + x * 0.01,
            "pressure": 1013.25 + x * 100,
            "altitude": 0.0 + x * 0.3048
        },
    }
    jsonObj = json.dumps(jsonDict)

    try:
        pipe.write_pipe(jsonObj, target)
        time.sleep(1)
    except OSError:
        print('Failed writing pipe..')
        print('Reconnecting..')
        target = pipe.get_pipe()
        time.sleep(1)
    except KeyboardInterrupt:
        print('Quitting..')
        pipe.close_pipe(target)
        sys.exit()
