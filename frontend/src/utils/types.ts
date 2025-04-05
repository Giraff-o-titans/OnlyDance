export type PoseType = {
  frame: number;
  timestamp: number;
  landmarks: { 
    LEFT_SHOULDER: number[];
    RIGHT_SHOULDER: number[];
    LEFT_ELBOW: number[];
    RIGHT_ELBOW: number[];
    LEFT_WRIST: number[];
    RIGHT_WRIST: number[];
    LEFT_HIP: number[];
    RIGHT_HIP: number[];
    LEFT_KNEE: number[];
    RIGHT_KNEE: number[];
    LEFT_ANKLE: number[];
    RIGHT_ANKLE: number[];
  };
};
