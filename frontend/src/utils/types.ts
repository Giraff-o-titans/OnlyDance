export type PoseType = {
  frame: number;
  timestamp: number;
  landmarks: Record<string, number[]>;
};

export type PoseData = {
  poses: PoseType[];
  audio: string;
};