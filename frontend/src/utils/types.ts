export type PoseType = {
  frame: number;
  timestamp: number;
  landmarks: Record<string, number[]>;
};

export type Dance = {
  poses: PoseType[];
  audio: string;
  bpm: number;
};

export type ScorePoint = {
  measure: number;
  score: number;
}

export const SCORE_THRESHOLD = 75;
