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
