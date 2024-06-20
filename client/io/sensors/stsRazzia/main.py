import json
import sys
import argparse

import numpy as np
import cv2 as cv
import time
import pipe

from sface import SFace
from yunet import YuNet

pipeName = 'FaceRecognitionSensor'
pipeTarget = pipe.get_pipe(pipeName)

PERSONS = [
    {
        'name': 'Daniel',
        'username': 'M05f3t',
        'imagePath': './faces/Daniel.jpeg',
        'imageName': 'Daniel.jpeg'
    },
    {
        'name': 'Peter',
        'username': 'pellef',
        'imagePath': './faces/Peter.png',
        'imageName': 'Peter.png'
    },
    {
        'name': 'Patrick',
        'username': 'PatrickPLG',
        'imagePath': './faces/Patrick.png',
        'imageName': 'Patrick.png'
    },
    {
        'name': 'Gustas',
        'username': 'gj',
        'imagePath': './faces/Gustas.png',
        'imageName': 'Gustas.png'
    }
]

backend_target_pairs = [
    [cv.dnn.DNN_BACKEND_OPENCV, cv.dnn.DNN_TARGET_CPU],
    [cv.dnn.DNN_BACKEND_CUDA, cv.dnn.DNN_TARGET_CUDA],
    [cv.dnn.DNN_BACKEND_CUDA, cv.dnn.DNN_TARGET_CUDA_FP16],
    [cv.dnn.DNN_BACKEND_TIMVX, cv.dnn.DNN_TARGET_NPU],
    [cv.dnn.DNN_BACKEND_CANN, cv.dnn.DNN_TARGET_NPU]
]

if __name__ == '__main__':
    try:
        backend_id = backend_target_pairs[0][0]
        target_id = backend_target_pairs[0][1]
        # Instantiate SFace for face recognition
        recognizer = SFace(modelPath='./models/face_recognition_sface_2021dec.onnx',
                           disType=0,
                           backendId=backend_id,
                           targetId=target_id)
        # Instantiate YuNet for face detection
        detector = YuNet(modelPath='./models/face_detection_yunet_2023mar.onnx',
                         inputSize=[320, 320],
                         confThreshold=0.9,
                         nmsThreshold=0.3,
                         topK=5000,
                         backendId=backend_id,
                         targetId=target_id)

        target_path = './faces/Daniel.jpeg'
        query_path = './testImg/test.jpg'


        def get_camera_stream():
            device_id = 0
            camera = cv.VideoCapture(device_id)
            return camera


        def set_model_input_size():
            w = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
            h = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))
            detector.setInputSize([w, h])


        cap = get_camera_stream()
        time.sleep(1)

        while cv.waitKey(1) < 0:
            time.sleep(0.5)
            hasFrame, frame = cap.read()

            for person in PERSONS:
                target = cv.imread(person['imagePath'])
                # load camera frame
                set_model_input_size()
                CameraFaces = detector.infer(frame)

                detector.setInputSize([target.shape[1], target.shape[0]])
                faces1 = detector.infer(target)

                # # Match
                scores = []
                matches = []
                for face in CameraFaces:
                    result = recognizer.match(target, faces1[0][:-1], frame, face[:-1])

                    scores.append(result[0])
                    matches.append(result[1])

                if len(matches) > 0 and matches[0] == 1:
                    jsonDict = {
                        "personDetected": person['name'],
                    }
                    jsonObj = json.dumps(person)
                    try:
                        pipe.write_pipe(jsonObj, pipeTarget)
                    except ConnectionError:
                        pipeTarget = pipe.get_pipe(pipeName)
                        pass


    except KeyboardInterrupt:
        pipe.close_pipe(pipeTarget)
        pass
