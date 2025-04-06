import pandas as pd
import json
import numpy as np

with open('data/deadpool.json', 'r') as file:
    pose_data = json.load(file)

results = {}
average_losses = []

for key, frames in expected.items():
    frame_details = []
    l2_norms = []
    
    for frame in frames:
        exp_vec = np.array(frame[0])
        obs_vec = np.array(frame[1])
        
        diff = exp_vec - obs_vec
        l2_norm = np.linalg.norm(diff)
        l2_norms.append(l2_norm)
        
        dot = np.dot(exp_vec, obs_vec)
        norm_exp = np.linalg.norm(exp_vec)
        norm_obs = np.linalg.norm(obs_vec)
        
        cos_theta = dot / (norm_exp * norm_obs)
        cos_theta = np.clip(cos_theta, -1.0, 1.0)
        angle_rad = np.arccos(cos_theta)
        angle_deg = np.degrees(angle_rad)
        
        cross = np.cross(exp_vec, obs_vec)
        
        frame_details.append({
            "l2_norm": l2_norm,
            "angle_deg": angle_deg,
            "cross_product": cross
        })
    

    avg_loss = np.mean(l2_norms)
    results[key] = {
        "average_loss": avg_loss,
        "frame_details": frame_details
    }
    average_losses.append(avg_loss)