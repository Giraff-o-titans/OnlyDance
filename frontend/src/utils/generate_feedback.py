import google.generativeai as genai

genai.configure(api_key="AIzaSyCMfuCXDUZWUe8GRG8nQi5TApTCbofYeJU")

model = genai.GenerativeModel('gemini-2.0-flash-lite')

prompt = """
In my app that teaches users how to dance, our scoring algorithm is essentially
designed to compare the positions of the user's body to the expected position
of the dance. We utilize a complex scoring algorithm that compares these
positions and then outputs a singular number that reflects the deviation of a
particular body part of the expected to the observed. Here is a dictionary that
contains information regarding the deviations of the user's body parts from
the expected positions:

{('LEFT_WRIST', 'LEFT_ELBOW'): {'l2_norm': np.float64(0.30281719196896334), 'angle_deg': np.float64(129.6133148458156), 'cross_product': array([-0.01234153, -0.0154068 ,  0.0037342 ])}, ('LEFT_ELBOW', 'LEFT_SHOULDER'): {'l2_norm': np.float64(0.024146182736650607), 'angle_deg': np.float64(7.013998030368426), 'cross_product': array([-0.00390879, -0.00171724,  0.0019976 ])}, ('LEFT_SHOULDER', 'LEFT_HIP'): {'l2_norm': np.float64(0.034743589192682986), 'angle_deg': np.float64(4.042656480025772), 'cross_product': array([-0.01572268,  0.00170348,  0.00537676])}, ('RIGHT_WRIST', 'RIGHT_ELBOW'): {'l2_norm': np.float64(0.31009329872998126), 'angle_deg': np.float64(94.93524337489765), 'cross_product': array([-0.02251898,  0.03428669, -0.01257828])}, ('RIGHT_ELBOW', 'RIGHT_SHOULDER'): {'l2_norm': np.float64(0.048963145170717995), 'angle_deg': np.float64(8.987738040743407), 'cross_product': array([-0.01211576,  0.00237087, -0.00505498])}, ('RIGHT_SHOULDER', 'RIGHT_HIP'): {'l2_norm': np.float64(0.061682109786255594), 'angle_deg': np.float64(6.620596024086863), 'cross_product': array([-0.02722141, -0.0024648 ,  0.01497389])}, ('LEFT_HIP', 'LEFT_KNEE'): {'l2_norm': np.float64(0.05023760654901271), 'angle_deg': np.float64(6.980590019971776), 'cross_product': array([ 3.98596794e-03, -9.89179543e-05, -1.89785076e-02])}, ('LEFT_KNEE', 'LEFT_ANKLE'): {'l2_norm': np.float64(0.06885003338945139), 'angle_deg': np.float64(9.826847805856259), 'cross_product': array([-0.01554029,  0.01004728, -0.01358429])}, ('RIGHT_HIP', 'RIGHT_KNEE'): {'l2_norm': np.float64(0.06938650752694057), 'angle_deg': np.float64(11.708596784716086), 'cross_product': array([-0.0206861 , -0.00415853,  0.01027103])}, ('RIGHT_KNEE', 'RIGHT_ANKLE'): {'l2_norm': np.float64(0.09285412724501209), 'angle_deg': np.float64(13.223353236561055), 'cross_product': array([-0.01397068, -0.01564398,  0.03070018])}}

Each key of the dictionary represents the pair of body parts being compared,
so for example ('LEFT_WRIST', 'LEFT_ELBOW') represents the error vector between
the expected position of the ('LEFT_WRIST', 'LEFT_ELBOW') joint and the actual
position of the ('LEFT_WRIST', 'LEFT_ELBOW') joint. The value of each key is a
dictionary that contains the following three values in the following order:
1. l2_norm: The L2 norm of the error vector, which is a measure of the distance
between the expected and actual positions of the joint.
2. angle_deg: The angle in degrees between the expected and actual positions
of the joint.
3. cross_product: The cross product of the expected and actual positions of
the joint, which is a measure of the direction of the error vector.
The cross product is represented as a numpy array.

Based on the values of this one frame, give feedback to the user on how to improve
their dance performance. The feedback should be specific to the body part
being compared and should suggest specific actions the user can take to improve
their performance. The feedback
should be clear and easy to understand, and should provide specific
recommendations for how the user can improve their performance. The feedback
should be tailored to the specific body part being compared, and should
suggest specific actions the user can take to improve their performance.
The feedback should be actionable and should help the user understand what
they need to do to improve their dance performance. Your feedback should be
general advice and only be a brief sentence. If there are multiple body parts
that require attention, limit the feedback to the top 3 body parts that require
the most attention. Keep the format exactly like this, don't include any other
text outside of this format:

1.  [Joint 1]: [Feedback for Joint 1]
2.  [Joint 2]: [Feedback for Joint 2]
3.  [Joint 3]: [Feedback for Joint 3]
"""

response = model.generate_content(prompt)

print(response.text)
