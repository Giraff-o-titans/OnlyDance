import pandas as pd
import json
import numpy as np

with open('data/pose_data.json', 'r') as file:
    pose_data = json.load(file)


REL_VEC_MAP = [
    ('LEFT_WRIST', 'LEFT_ELBOW'),
    ('LEFT_ELBOW', 'LEFT_SHOULDER'),
    ('LEFT_SHOULDER', 'LEFT_HIP'),
    ('RIGHT_WRIST', 'RIGHT_ELBOW'),
    ('RIGHT_ELBOW', 'RIGHT_SHOULDER'),
    ('RIGHT_SHOULDER', 'RIGHT_HIP'),
    ('LEFT_HIP', 'LEFT_KNEE'),
    ('LEFT_KNEE', 'LEFT_ANKLE'),
    ('RIGHT_HIP', 'RIGHT_KNEE'),
    ('RIGHT_KNEE', 'RIGHT_ANKLE')
]

"""
[{'frame': 0,
  'timestamp': 0.0,
  'landmarks': {'LEFT_SHOULDER': [0.19183723628520966,
    0.4527665972709656,
    0.11228542774915695],
   'RIGHT_SHOULDER': [-0.11523714661598206,
    0.5224035382270813,
    0.0618785098195076],
   'LEFT_ELBOW': [0.28123152256011963,
    0.28129351139068604,
    0.13979975879192352],
   'RIGHT_ELBOW': [-0.19556871056556702,
    0.2384415864944458,
"""

# expected and actual are in the 'landmarks' dictionary format above

def calculate_difference_by_frame(expected, actual):
    
    expected_vectors = {}
    actual_vectors = {}

    for key in REL_VEC_MAP:
        expected_vector = (np.array(expected[key[0]]) - np.array(expected[key[1]]))
        expected_vectors[key] = expected_vector
        actual_vector = (np.array(actual[key[0]]) - np.array(actual[key[1]]))
        actual_vectors[key] = actual_vector

    return (expected_vectors, actual_vectors)

expected, actual = calculate_difference_by_frame(pose_data[0]['landmarks'], pose_data[100]['landmarks'])

results = {}

for k in expected:
    a = expected[k]
    b = actual[k]
    diff = a - b
    l2_norm = np.linalg.norm(diff)

    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    cos_theta = dot / (norm_a * norm_b)
    cos_theta = np.clip(cos_theta, -1.0, 1.0)  # prevent numerical errors
    angle_rad = np.arccos(cos_theta)
    angle_deg = np.degrees(angle_rad)

    cross = np.cross(a, b)

    results[k] = {
        "l2_norm": l2_norm,
        "angle_deg": angle_deg,
        "cross_product": cross,
    }

print(results)