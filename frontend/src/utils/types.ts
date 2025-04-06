export type PoseType = {
  frame: number;
  timestamp: number;
  landmarks: Record<string, number[]>;
};

export type PoseData = {
  poses: PoseType[];
  audio: string;
};

export type ScorePoint = {
  measure: number;
  score: number;
}

export const SCORE_THRESHOLD = 50;
