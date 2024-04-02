import time
import os
import select
import tkinter as tk
from PIL import Image, ImageTk
import cv2 as cv
import numpy as np
from yunet import YuNet as YuNetClass

IPC_PIPE = "pipeId"
while True:
    try:
        ioWrite = os.open(IPC_PIPE, os.O_WRONLY)
        print("Pipe B ready")
        break
    except:
        # Wait until Pipe B has been initialized
        print("except")
        pass


file_path = '/home/mosfet/Projects/P6-bachelor/CameraTrackerTest/face_detection_yunet_2023mar.onnx'

# Angiv stien til din ONNX-model
modelPath = file_path

# Initialisér YuNet
model = YuNetClass(modelPath=modelPath,
                   inputSize=[320, 320],
                   confThreshold=0.6,
                   nmsThreshold=0.3,
                   topK=5000,
                   backendId=0,
                   targetId=0)

cap = cv.VideoCapture(0)

smallest_box_area = float('inf')  # Initialiser til uendeligt stort

def visualize(image, results, scale=(1.0, 1.0), box_color=(0, 255, 0), text_color=(255, 255, 255)):
    global smallest_box_area  # Declare as global to modify the variable within this function
    output = image.copy()
    scaleX, scaleY = scale
    text_scale_dynamic = 0.5  # Startværdi for dynamisk tekststørrelse
    conf_text_scale = 0.5  # Fast skriftstørrelse for konfidensniveau
    smallest_box_area = float('inf')  # Initialiser til uendeligt stort

    for det in results:
        x1 = int(det[0] * scaleX)
        y1 = int(det[1] * scaleY)
        x2 = int((det[0] + det[2]) * scaleX)
        y2 = int((det[1] + det[3]) * scaleY)
        box_width = x2 - x1
        box_height = y2 - y1
        box_area = box_width * box_height

        # Opdater den mindste box_area (til at finde den "fjerneste" person)
        if box_area < smallest_box_area and box_area > 0:
            smallest_box_area = box_area
            text_scale_dynamic = 0.7 + 5000 / max(smallest_box_area, 1)

        # Definer 'conf' korrekt her. Antager at 'conf' er den sidste værdi i 'det'
        conf = det[-1]

        # Tegn bounding boxen
        cv.rectangle(output, (x1, y1), (x2, y2), box_color, 2)

        # Vis konfidensniveau med en fast skriftstørrelse
        cv.putText(output, '{:.4f}'.format(conf), (x1, y1 - 10), cv.FONT_HERSHEY_DUPLEX, conf_text_scale, text_color)
        if len(det) > 14:
            landmarks = det[4:14].astype(np.int32).reshape((5, 2))
            for idx, landmark in enumerate(landmarks):
                landmarkX = int(landmark[0] * scaleX)
                landmarkY = int(landmark[1] * scaleY)
                cv.circle(output, (landmarkX, landmarkY), 2, (255, 255, 255), -1)

    # Tilføj "Din dynamiske tekst" med en dynamisk tekststørrelse
    cv.putText(output, "Gustas er en bozo", (10, 30), cv.FONT_HERSHEY_SIMPLEX, text_scale_dynamic, text_color, 2)
    return output

def update_text_size():
    global smallest_box_area  # Declare as global to access the variable
    hasFrame, frame = cap.read()
    if not hasFrame:
        print('No frames grabbed!')
        return

    # Ændr størrelsen på frame til det forventede input format for modellen
    frame_resized = cv.resize(frame, (320, 320))

    # Inferens
    results = model.infer(frame_resized)

    # Visualiser resultaterne på det originale frame
    # Bemærk: Du skal måske skalere op tegningen til det originale frames størrelse
    frame = visualize(frame, results, scale=(frame.shape[1] / 320, frame.shape[0] / 320))

    # Opdater teksten i Tkinter
    text_scale_dynamic = 0.7 + 5000 / max(smallest_box_area, 1)
    os.write(ioWrite, str(text_scale_dynamic).encode('utf-8'))  # Write to Pipe
    canvas.itemconfig(text_id, text="Gustas er en bozo", font=("Helvetica", int(text_scale_dynamic * 20)), fill="white")  # Scale font size dynamically and set text color
    root.after(10, update_text_size)  # Call this function again after 10 milliseconds

    # Display the OpenCV window
    cv.imshow('OpenCV Window', frame)
    cv.waitKey(1)  # Needed to refresh OpenCV window

# Tkinter GUI
root = tk.Tk()
root.title("Dynamic Text Size Demo")
root.configure(bg='black')

# Example image
example_image = Image.open("/home/mosfet/Projects/P6-bachelor/CameraTrackerTest/img/Artwork003.jpg")
example_image = example_image.resize((800, 600))
example_photo = ImageTk.PhotoImage(example_image)

# Create a canvas to display the example image
canvas = tk.Canvas(root, width=800, height=600, bg='black', highlightthickness=0)
canvas.pack()
canvas.create_image(0, 0, anchor=tk.NW, image=example_photo)

# Create text on canvas
text_id = canvas.create_text(10, 10, anchor=tk.NW, text="Gustas er en bozo", font=("Helvetica", 20), fill="white")

# Start updating the text size dynamically
update_text_size()

root.mainloop()

