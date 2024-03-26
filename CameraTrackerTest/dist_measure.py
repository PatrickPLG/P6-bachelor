import numpy as np
import cv2 as cv
from yunet import YuNet as YuNetClass

# Angiv stien til din ONNX-model
modelPath = "face_detection_yunet_2023mar.onnx"

# Initialisér YuNet
model = YuNetClass(modelPath=modelPath,
                   inputSize=[320, 320],
                   confThreshold=0.6,
                   nmsThreshold=0.3,
                   topK=5000,
                   backendId=0,
                   targetId=0)

cap = cv.VideoCapture(0)

previous_text_scale = 0.5  # Startværdi for tekstskalaen

previous_text_scale = 0.5  # Startværdi for tekstskalaen

def visualize(image, results, scale=(1.0, 1.0), box_color=(0, 255, 0), text_color=(0, 0, 255), smoothing_factor=0.05):
    global previous_text_scale
    output = image.copy()
    scaleX, scaleY = scale
    conf_text_scale = 0.5  # Fast skriftstørrelse for konfidensniveau
    max_box_area = 0  # Til at finde den største box

    for det in results:
        x1, y1, x2, y2 = [int(dim) for dim in [det[0] * scaleX, det[1] * scaleY, (det[0] + det[2]) * scaleX, (det[1] + det[3]) * scaleY]]
        box_area = (x2 - x1) * (y2 - y1)

        if box_area > max_box_area:
            max_box_area = box_area

        conf = det[-1]

        cv.rectangle(output, (x1, y1), (x2, y2), box_color, 2)
        cv.putText(output, '{:.4f}'.format(conf), (x1, y1 - 10), cv.FONT_HERSHEY_DUPLEX, conf_text_scale, text_color)

        # Retter anvendelsen af skalering på landmarks
        if len(det) > 14:
            landmarks = det[4:14].astype(np.int32).reshape((5, 2))
            for landmark in landmarks:
                # Anvender korrekt skalering på landmarks
                landmarkX, landmarkY = [int(landmark[0] * scaleX), int(landmark[1] * scaleY)]
                cv.circle(output, (landmarkX, landmarkY), 2, (255, 255, 255), -1)

    # Dynamisk justering med glidende gennemsnit for smooth ændring
    new_text_scale = 0.5 + (5000 / max(max_box_area, 1))
    text_scale_dynamic = previous_text_scale + (new_text_scale - previous_text_scale) * smoothing_factor
    previous_text_scale = text_scale_dynamic  # Opdaterer den globale variabel til næste frame

    cv.putText(output, "Gustas er en bozo", (50, output.shape[0] - 50), cv.FONT_HERSHEY_SIMPLEX, text_scale_dynamic, (255, 255, 255), 2)
    
    return output




while cv.waitKey(1) < 0:
    hasFrame, frame = cap.read()
    if not hasFrame:
        print('No frames grabbed!')
        break

    # Ændr størrelsen på frame til det forventede input format for modellen
    frame_resized = cv.resize(frame, (320, 320))

    # Inferens
    results = model.infer(frame_resized)

    # Visualiser resultaterne på det originale frame
    frame = visualize(frame, results, scale=(frame.shape[1] / 320, frame.shape[0] / 320))

    # Vis det opdaterede frame
    cv.imshow('YuNet Demo', frame)
