import json

import numpy as np
import cv2 as cv
import pipe
import time

pipeName = 'FaceRecognitionSensor'

faceCount = 0
lookedAtScreenSeconds = 0.0
pipeTarget = pipe.get_pipe(pipeName)


class YuNet:
    def __init__(self, modelPath, inputSize=None, confThreshold=0.6, nmsThreshold=0.3, topK=5000, backendId=0,
                 targetId=0):
        if inputSize is None:
            inputSize = [320, 320]
        self._modelPath = modelPath
        self._inputSize = tuple(inputSize)  # [w, h]
        self._confThreshold = confThreshold
        self._nmsThreshold = nmsThreshold
        self._topK = topK
        self._backendId = backendId
        self._targetId = targetId

        self._model = cv.FaceDetectorYN.create(
            model=self._modelPath,
            config="",
            input_size=self._inputSize,
            score_threshold=self._confThreshold,
            nms_threshold=self._nmsThreshold,
            top_k=self._topK,
            backend_id=self._backendId,
            target_id=self._targetId)

    @property
    def name(self):
        return self.__class__.__name__

    def setBackendAndTarget(self, backendId, targetId):
        self._backendId = backendId
        self._targetId = targetId
        self._model = cv.FaceDetectorYN.create(
            model=self._modelPath,
            config="",
            input_size=self._inputSize,
            score_threshold=self._confThreshold,
            nms_threshold=self._nmsThreshold,
            top_k=self._topK,
            backend_id=self._backendId,
            target_id=self._targetId)

    def setInputSize(self, input_size):
        self._model.setInputSize(tuple(input_size))

    def infer(self, image):
        # Forward
        faces = self._model.detect(image)
        return np.array([]) if faces[1] is None else faces[1]


def main():
    path_to_model = './openCV_models/face_detection_yunet_2023mar.onnx'
    backend_id = cv.dnn.DNN_BACKEND_DEFAULT
    target_id = cv.dnn.DNN_TARGET_CPU
    model = YuNet(modelPath=path_to_model,
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
        global pipeName
        jsonDict = {
            "facesDetected": faceCount,
            "lookedAtScreenInSeconds": lookedAtScreenSeconds
        }
        jsonObj = json.dumps(jsonDict)
        try:
            pipe.write_pipe(jsonObj, pipeTarget)
        except ConnectionError:
            # Reconnect to pipe
            pipeTarget = pipe.get_pipe(pipeName)
            pass

    def detectFaces():
        global faceCount
        tm = cv.TickMeter()
        while cv.waitKey(1) < 0:
            hasFrame, frame = cap.read()
            tm.start()
            results = model.infer(frame)  # results is a tuple
            print(results)
            time.sleep(0.1)
            faceCount = len(results)
            sendDataToPipe()

            tm.reset()

    def setModelInputSize():
        w = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))
        model.setInputSize([w, h])

    def getCameraStream():
        device_id = 0
        camera = cv.VideoCapture(device_id)
        return camera

    cap = getCameraStream()
    setModelInputSize()
    detectFaces()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pipe.close_pipe(pipeTarget)
        pass
