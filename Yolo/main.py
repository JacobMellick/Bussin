import cv2
import argparse
import requests
import time
from ultralytics import YOLO
import supervision as sv
import numpy as np

# Define the Django API URL
DJANGO_API_URL = "http://127.0.0.1:8000/api/crowd-status/"

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="YOLOv8")
    parser.add_argument(
        "--webcam-resolution", 
        type=int, 
        default=[1280, 720], 
        nargs=2
    )
    args = parser.parse_args()
    return args

def send_data_to_django(count):
    """ Sends the number of people detected to the Django backend. """
    try:
        response = requests.post(DJANGO_API_URL, json={"count": count})
        print("Response from server:", response.json())
    except requests.exceptions.RequestException as e:
        print("Error sending data:", e)

def main():
    args = parse_args()
    cap = cv2.VideoCapture(1)  # Change to 0 for primary webcam
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, args.webcam_resolution[0])
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, args.webcam_resolution[1])

    model = YOLO("yolov8l.pt")
    bbox_annotator = sv.BoxAnnotator(thickness=2)

    last_sent_time = time.time() - 60

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        result = model(frame)[0]
        detections = sv.Detections.from_ultralytics(result)

        person_detections = detections[detections.class_id == 0]
        num_people = len(person_detections)

        # Check if 1 minute has passed
        current_time = time.time()
        if current_time - last_sent_time >= 60: 
            send_data_to_django(num_people)
            last_sent_time = current_time  

        frame = bbox_annotator.annotate(scene=frame, detections=person_detections)

        for i, (x, y, x2, y2) in enumerate(person_detections.xyxy):
            label = f"Person {person_detections.confidence[i]:.2f}"
            cv2.putText(
                frame, label, (int(x), int(y) - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2
            )

        cv2.imshow("YOLOv8 - People Detection", frame)

        if cv2.waitKey(30) == 27:  # Press 'Esc' to exit the webcam
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
