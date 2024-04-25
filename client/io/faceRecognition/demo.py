# This file is part of OpenCV Zoo project.
# It is subject to the license terms in the LICENSE file found in the same directory.
#
# Copyright (C) 2021, Shenzhen Institute of Artificial Intelligence and Robotics for Society, all rights reserved.
# Third party copyrights are property of their respective owners.

import argparse
import json
import os
import sys
import numpy as np
import cv2 as cv
import time
from yunet import YuNet
import pipe

faceCount = 0
lookedAtScreenSeconds = 0.0
pipeTarget = pipe.get_pipe()

def main():
    # Instantiate model
    pathToOnnx = './face_detection_yunet_2023mar.onnx'
    backend_id = cv.dnn.DNN_BACKEND_DEFAULT
    target_id = cv.dnn.DNN_TARGET_CPU
    model = YuNet(modelPath=pathToOnnx,
                  inputSize=[320, 320],
                  confThreshold=0.6,
                  nmsThreshold=0.3,
                  topK=5000,
                  backendId=backend_id,
                  targetId=target_id)

    def sendDataToPipe():
        global faceCount
        global lookedAtScreenSeconds
        global pipeTarget
        jsonDict = {
            "facesDetected": faceCount,
            "lookedAtScreenInSeconds": lookedAtScreenSeconds
        }
        jsonObj = json.dumps(jsonDict)
        pipe.write_pipe(jsonObj, pipeTarget)

    def detectFaces():
        global faceCount
        tm = cv.TickMeter()
        while cv.waitKey(1) < 0:
            hasFrame, frame = cap.read()
            tm.start()
            results = model.infer(frame)  # results is a tuple
            time.sleep(0.1)
            faceCount = len(results)
            sendDataToPipe()
            print(faceCount)

            tm.reset()

    def setModelInputSize():
        w = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))
        model.setInputSize([w, h])

    def getCameraStream():
        deviceId = 0
        camera = cv.VideoCapture(deviceId)
        return camera

    cap = getCameraStream()
    setModelInputSize()
    detectFaces()


if __name__ == '__main__':
    main()

    # if results.shape[0] > 0 and started == False:
    #     started = True
    #     startSecond = time.perf_counter()
    #     if results.shape[0] > faceCount:
    #         faceCount = results.shape[0]
    # elif results.shape[0] == 0 and started == True:
    #     endSecond = time.perf_counter()
    #     timeSecond = endSecond - startSecond
    #     lookedAtScreenSeconds.append(timeSecond)
    #     started = False
    #     jsonDict = {
    #         "key": "sensor_data",
    #         "data": {
    #             "HighestNumberOfFacesDetected": faceCount,
    #             "lookedAtScreenInSeconds": lookedAtScreenSeconds
    #         }
    #     }
    #     jsonObj = json.dumps(jsonDict)
    #     sendDataToPipe(FacesDetectedNumber=faceCount,
    #                    LookedAt=sum(lookedAtScreenSeconds))

    # Draw results on the input image
    # frame = visualize(frame, results, fps=tm.getFPS())

    # Visualize results in a new Window
    # cv.imshow('YuNet Demo', frame)
