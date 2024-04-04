import sys
import time
import os
import pipe

target = pipe.get_pipe()
x = 0
while True:
    x = x + 1
    try:
        pipe.write_pipe(str(x), target)
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
