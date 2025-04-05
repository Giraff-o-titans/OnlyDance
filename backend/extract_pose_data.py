import cv2
import mediapipe as mp
import json

VIDEO_PATH = "assets/deadpool_cut.mp4"
OUTPUT_JSON = "../data/pose_data.json"
FRAME_INTERVAL = 1  # Process every 5th frame

mp_pose = mp.solutions.pose
POSE_LANDMARKS = mp_pose.PoseLandmark

# Only include upper-body and leg joints
KEYPOINTS = [
    "LEFT_SHOULDER",
    "RIGHT_SHOULDER",
    "LEFT_ELBOW",
    "RIGHT_ELBOW",
    "LEFT_WRIST",
    "RIGHT_WRIST",
    "LEFT_HIP",
    "RIGHT_HIP",
    "LEFT_KNEE",
    "RIGHT_KNEE",
    "LEFT_ANKLE",
    "RIGHT_ANKLE",
    # "NOSE",
]

def extract_landmarks(results):
    landmark_dict = {}
    if not results.pose_world_landmarks:
        return None

    for key in KEYPOINTS:
        idx = getattr(POSE_LANDMARKS, key).value
        lm = results.pose_world_landmarks.landmark[idx]
        landmark_dict[key] = [lm.x, -lm.y, -lm.z]

    return landmark_dict

def main():
    cap = cv2.VideoCapture(VIDEO_PATH)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_number = 0
    output = []

    with mp_pose.Pose(
        static_image_mode=False,
        model_complexity=2,
        enable_segmentation=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    ) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            if frame_number % FRAME_INTERVAL == 0:
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = pose.process(rgb)

                landmarks = extract_landmarks(results)
                if landmarks:
                    output.append(
                        {
                            "frame": frame_number,
                            "timestamp": round(frame_number / fps, 3),
                            "landmarks": landmarks,
                        }
                    )
            frame_number += 1
    cap.release()

    with open(OUTPUT_JSON, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Saved {len(output)} frames to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
