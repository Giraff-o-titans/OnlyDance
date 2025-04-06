import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-2.0-flash-lite')

prompt = """
In my dance teaching app, we evaluate a user's performance by comparing their body positions to expected positions using a scoring algorithm. For a given frame, we compute deviations for specific joint pairs. Each deviation includes:

- `l2_norm`: The L2 norm of the error vector, indicating the distance between expected and actual joint positions.
- `angle_deg`: The angular difference (in degrees) between the expected and actual joint vectors.
- `cross_product`: A 3D vector showing the directional difference between expected and actual vectors.

Here is a dictionary representing deviations for each joint pair in a single frame:

```python
{('LEFT_WRIST', 'LEFT_ELBOW'): {'l2_norm': np.float64(0.3028), 'angle_deg': np.float64(129.61), 'cross_product': array([-0.0123, -0.0154,  0.0037])},
 ('LEFT_ELBOW', 'LEFT_SHOULDER'): {'l2_norm': np.float64(0.0241), 'angle_deg': np.float64(7.01), 'cross_product': array([-0.0039, -0.0017,  0.0020])},
 ('LEFT_SHOULDER', 'LEFT_HIP'): {'l2_norm': np.float64(0.0347), 'angle_deg': np.float64(4.04), 'cross_product': array([-0.0157,  0.0017,  0.0054])},
 ...
}
```

Each key is a tuple representing the joint pair being compared. Your task is:

**Generate feedback based on this dictionary.**  
Specifically:
- Identify the **top 3 joint pairs** with the **highest l2_norm values** (greatest deviations).
- For each of these, give **clear, specific, and actionable advice** on how the user can adjust their body position to better match the expected pose.
- Each piece of feedback should be **one short, simple sentence**, targeted to the joint pair mentioned.

**Output format (strictly follow this):**
1. [Joint 1]: [Feedback for Joint 1]  
2. [Joint 2]: [Feedback for Joint 2]  
3. [Joint 3]: [Feedback for Joint 3]  

Do not include any additional explanation or preamble outside this format.
"""

response = model.generate_content(prompt)

print(response.text)
