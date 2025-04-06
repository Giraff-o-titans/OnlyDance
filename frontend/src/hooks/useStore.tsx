import { create } from "zustand";
import { createSetter } from "../utils/functions";
import { PoseData, PoseType } from "../utils/types";

interface StoreType {
  score: number;
  frame: number;
  collect: boolean;
  centerText: string;
  userPose: PoseType[];
  poseData: PoseData;
  setScore: (score: number | ((prev: number) => number)) => void;
  setFrame: (frame: number | ((prev: number) => number)) => void;
  setCenterText: (text: string | ((prev: string) => string)) => void;
  setCollect: (collect: boolean | ((prev: boolean) => boolean)) => void;
  setUserPose: (pose: PoseType[] | ((prev: PoseType[]) => PoseType[])) => void;
  setPoseData: (pose: PoseData | ((prev: PoseData) => PoseData)) => void;
}

export const useStore = create<StoreType>((set) => ({
  score: 0,
  frame: 0,
  userPose: [],
  centerText: "",
  collect: false,
  poseData: {} as PoseData,
  setScore: createSetter<StoreType>(set)("score"),
  setFrame: createSetter<StoreType>(set)("frame"),
  setCollect: createSetter<StoreType>(set)("collect"),
  setUserPose: createSetter<StoreType>(set)("userPose"),
  setPoseData: createSetter<StoreType>(set)("poseData"),
  setCenterText: createSetter<StoreType>(set)("centerText"),
}));
