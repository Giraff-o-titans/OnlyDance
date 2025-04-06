import { create } from "zustand";
import { createSetter } from "../utils/functions";
import { Dance, PoseType, ScorePoint } from "../utils/types";

const userPoseRef = { current: [] as PoseType[] };

interface StoreType {
  score: number;
  frame: number;
  collect: boolean;
  centerText: string;
  poseData: Dance;
  userPose: PoseType[];
  scorePoints: ScorePoint[];
  userPoseRef: typeof userPoseRef;
  setScore: (score: number | ((prev: number) => number)) => void;
  setFrame: (frame: number | ((prev: number) => number)) => void;
  setCenterText: (text: string | ((prev: string) => string)) => void;
  setCollect: (collect: boolean | ((prev: boolean) => boolean)) => void;
  setDance: (pose: Dance | ((prev: Dance) => Dance)) => void;
  setUserPose: (pose: PoseType[] | ((prev: PoseType[]) => PoseType[])) => void;
  setScorePoints: (points: ScorePoint[] | ((prev: ScorePoint[]) => ScorePoint[])) => void;
}

export const useStore = create<StoreType>((set, get) => ({
  score: 0,
  frame: 0,
  userPose: [],
  userPoseRef,
  centerText: "",
  collect: false,
  scorePoints: [],
  poseData: {} as Dance,
  setScore: createSetter<StoreType>(set)("score"),
  setFrame: createSetter<StoreType>(set)("frame"),
  setCollect: createSetter<StoreType>(set)("collect"),
  setUserPose: (update) => {
    const newValue = typeof update === "function" ? update(get().userPose) : update;
    userPoseRef.current = newValue; // 💥 keep ref updated
    set({ userPose: newValue });
  },
  setDance: createSetter<StoreType>(set)("poseData"),
  setCenterText: createSetter<StoreType>(set)("centerText"),
  setScorePoints: createSetter<StoreType>(set)("scorePoints"),
}));
