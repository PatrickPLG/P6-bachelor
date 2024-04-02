import cv2
import mediapipe as mp

# Initialize MediaPipe Face Mesh.
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5)

# Define the landmarks for one eye.
eye_landmarks = [33, 7, 163, 144, 145, 153, 154, 155, 173, 157, 158, 159, 160, 161, 246]


window_width = 200
window_height = 100

camera = cv2.VideoCapture(0)
# Change res to what your cam supports. Higher is better testing shows.
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 3840)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 2160)

while True:
    ret, frame = camera.read()
    if not ret:
        print("Shit")
        break

    # Convert the BGR image to RGB.
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame to find face landmarks.
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Extract the eye landmarks.
            eye_points = [(int(face_landmarks.landmark[idx].x * frame.shape[1]),
                           int(face_landmarks.landmark[idx].y * frame.shape[0])) for idx in eye_landmarks]

            # Calculate the bounding box around the eye.
            x_min = min([point[0] for point in eye_points])
            x_max = max([point[0] for point in eye_points])
            y_min = min([point[1] for point in eye_points])
            y_max = max([point[1] for point in eye_points])

            # Add some padding to the bounding box.
            pad = 5
            x_min = max(x_min - pad, 0)
            x_max = min(x_max + pad, frame.shape[1])
            y_min = max(y_min - pad, 0)
            y_max = min(y_max + pad, frame.shape[0])

            # Crop the frame to show only the eye area.
            eye_area = frame[y_min:y_max, x_min:x_max]

            # Convert the cropped eye area to grayscale.
            gray_eye = cv2.cvtColor(eye_area, cv2.COLOR_BGR2GRAY)

            # Blur image to get prettier area. Tradeoff accuracy. Worth
            gray_eye = cv2.GaussianBlur(gray_eye, (7,7),0)

            # Apply thresholding to the grayscale eye area. Try changing threshold and maxval for better tracking
            _, threshold_eye = cv2.threshold(gray_eye, 50, 255, cv2.THRESH_BINARY_INV)

            # Resize the thresholded eye area to the fixed window size.
            threshold_eye_resized = cv2.resize(threshold_eye, (window_width, window_height))

            # Normal eye resized
            normal_eye_resized = cv2.resize(eye_area, (window_width, window_height))

            # Display normal eye and processed eye
            cv2.imshow('Black&White', threshold_eye_resized)
            cv2.imshow('Standard', normal_eye_resized)

    # Break the loop when 'q' is pressed.
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

camera.release()
cv2.destroyAllWindows()


# TO DO: Create contors around eyes.
# Create box based on contors and use it to find center point.
# Create function that outputs coordinates of center point in comparison to landmarks. Fx. +y = up +x = right and so on