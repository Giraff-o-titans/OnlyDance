from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import numpy as np

# Define the PoseType
class PoseType(BaseModel):
    frame: int
    timestamp: float
    landmarks: Dict[str, List[float]]

# Define the request body structure
class ScoreRequest(BaseModel):
    actual: List[PoseType]
    expected: List[PoseType]

app = FastAPI()

# Add CORS middleware to allow your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/score")
def score(request: ScoreRequest):
    actual = request.actual
    expected = request.expected
    
    return {"score": np.random.uniform() * 100}

def lin_interpolate_frames(frame1, frame2, timestamp):
    output = {}
    output["timestamp"] = timestamp
    output_landmarks = {}
    landmarks = [f"{side}_{bodypart}" for side in ["LEFT", "RIGHT"] for bodypart in ["WRIST", "ELBOW", "SHOULDER", "HIP", "KNEE", "ANKLE"]]
    fraction = (timestamp - frame1["timestamp"]) / (frame2["timestamp"] - frame1["timestamp"])
    for landmark in landmarks:
        output_landmarks[landmark] = [
            frame1["landmarks"][landmark][0] + fraction * (frame2["landmarks"][landmark][0] - frame1["landmarks"][landmark][0]),
            frame1["landmarks"][landmark][1] + fraction * (frame2["landmarks"][landmark][1] - frame1["landmarks"][landmark][1]),
            frame1["landmarks"][landmark][2] + fraction * (frame2["landmarks"][landmark][2] - frame1["landmarks"][landmark][2])
        ]
    output['landmarks'] = output_landmarks
    return output

def fill_values(template_pose_data, user_pose_data):
    # Main function you want to use to interpolate a bunch at once
    # Takes in two pose data lists and creates new values so that both are defined on same timestamps
    all_timestamps_ordered = [-1]
    num_points_temp = len(template_pose_data)
    num_points_user = len(user_pose_data)
    temp_pointer = 0
    user_pointer = 0
    temp_orig_timestamps = set()
    user_orig_timestamps = set()
    while True:
        try:
            curr_temp = template_pose_data[temp_pointer]["timestamp"]
            curr_user = user_pose_data[user_pointer]["timestamp"]
        except:
            break

        if temp_pointer >= num_points_temp and all_timestamps_ordered[-1]:
            if user_pointer >= num_points_user:
                break
            if all_timestamps_ordered[-1] != curr_user:
                all_timestamps_ordered.append(curr_user)
                user_orig_timestamps.add(curr_user)
            user_pointer += 1
        elif user_pointer >= num_points_user:
            if all_timestamps_ordered[-1] != curr_temp:
                all_timestamps_ordered.append(curr_temp)
                temp_orig_timestamps.add(curr_temp)
            temp_pointer += 1                        
        elif curr_temp < curr_user:
            if all_timestamps_ordered[-1] != curr_temp:
                all_timestamps_ordered.append(curr_temp)
                temp_orig_timestamps.add(curr_temp)
            temp_pointer += 1
        else: 
            if all_timestamps_ordered[-1] != curr_user:
                all_timestamps_ordered.append(curr_user)
                user_orig_timestamps.add(curr_user)
            user_pointer += 1

    all_timestamps_ordered = all_timestamps_ordered[1:]
    
    temp_out = []
    user_out = []

    temp_new_pointer = 0
    user_new_pointer = 0

    for timestamp in all_timestamps_ordered:
        if timestamp in temp_orig_timestamps:
            temp_out.append(template_pose_data[temp_new_pointer])
            temp_new_pointer += 1
        else:
            # lin interpolate uh template_pose_data[temp_new_pointer - 1] and template_pose_data[temp_new_pointer]
            temp_out.append(lin_interpolate_frames(template_pose_data[temp_new_pointer - 1], template_pose_data[temp_new_pointer], timestamp))
        if timestamp in user_orig_timestamps:
            user_out.append(user_pose_data[user_new_pointer])
            user_new_pointer += 1
        else:
            # lin interpolate uh user_pose_data[user_new_pointer - 1] and user_pose_data[user_new_pointer]       
            user_out.append(lin_interpolate_frames(user_pose_data[user_new_pointer - 1], user_pose_data[user_new_pointer], timestamp))

    return temp_out, user_out


def find_normalized_relative_vec_from_obj(from_landmark, to_landmark, frame_obj):
    fromx = frame_obj["landmarks"][from_landmark][0]
    fromy = frame_obj["landmarks"][from_landmark][1]
    fromz = frame_obj["landmarks"][from_landmark][2]
    tox = frame_obj["landmarks"][to_landmark][0]
    toy = frame_obj["landmarks"][to_landmark][1]
    toz = frame_obj["landmarks"][to_landmark][2]
    relative_vec = [tox - fromx, toy-fromy, toz-fromz]
    relative_vec_norm = np.sqrt((relative_vec[0])**2 + (relative_vec[1])**2 + (relative_vec[2])**2)
    return [relative_vec[0] / relative_vec_norm, relative_vec[1] / relative_vec_norm,relative_vec[2] / relative_vec_norm]


def find_normalized_relative_vec(from_landmark, to_landmark, frame, pose_data):
    # prob best not to use this function, uses frames which wont work with interpolated values
    frame_obj = pose_data[frame - pose_data[0]["frame"]]
    fromx = frame_obj["landmarks"][from_landmark][0]
    fromy = frame_obj["landmarks"][from_landmark][1]
    fromz = frame_obj["landmarks"][from_landmark][2]
    tox = frame_obj["landmarks"][to_landmark][0]
    toy = frame_obj["landmarks"][to_landmark][1]
    toz = frame_obj["landmarks"][to_landmark][2]
    relative_vec = [tox - fromx, toy-fromy, toz-fromz]
    relative_vec_norm = np.sqrt((relative_vec[0])**2 + (relative_vec[1])**2 + (relative_vec[2])**2)
    return [relative_vec[0] / relative_vec_norm, relative_vec[1] / relative_vec_norm,relative_vec[2] / relative_vec_norm]

def find_weights(pose_data):
    REL_VEC_TUPS = (
        ("LEFT_WRIST", "LEFT_ELBOW"),
        ("LEFT_ELBOW", "LEFT_SHOULDER"),
        ("LEFT_SHOULDER", "RIGHT_SHOULDER"),
        ("RIGHT_WRIST", "RIGHT_ELBOW"),
        ("RIGHT_ELBOW", "RIGHT_SHOULDER"),
        ("LEFT_SHOULDER", "LEFT_HIP"),
        ("RIGHT_SHOULDER", "RIGHT_HIP"),
        ("LEFT_HIP", "RIGHT_HIP"),
        ("LEFT_HIP", "LEFT_KNEE"),
        ("LEFT_KNEE", "LEFT_ANKLE"),
        ("RIGHT_HIP", "RIGHT_KNEE"),
        ("RIGHT_KNEE", "RIGHT_ANKLE")
    )
    weights = []
    for rel_vec in REL_VEC_TUPS:
        diffs = []

        from_joint = rel_vec[0]
        to_joint = rel_vec[1]

        for i in range(1, len(pose_data)):
            first_normed_rel_vec = find_normalized_relative_vec_from_obj(from_joint, to_joint, pose_data[i-1])
            second_normed_rel_vec = find_normalized_relative_vec(from_joint, to_joint, pose_data[i])
            diff_norm = np.linalg.norm(np.array(second_normed_rel_vec) - np.array(first_normed_rel_vec))
            diffs.append(diff_norm)

        weights.append(sum(diffs))
    return weights

