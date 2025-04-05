import { create } from "zustand";
import { createSetter } from "../utils/functions";
import { PoseType } from "../utils/types";

interface StoreType {
  score: number;
  frame: number;
  collect: boolean;
  userPose: PoseType[];
  setScore: (score: number | ((prev: number) => number)) => void;
  setFrame: (frame: number | ((prev: number) => number)) => void;
  setCollect: (collect: boolean | ((prev: boolean) => boolean)) => void;
  setUserPose: (pose: PoseType[] | ((prev: PoseType[]) => PoseType[])) => void;
}

export const useStore = create<StoreType>((set) => ({
  score: 0,
  frame: 0,
  userPose: [],
  collect: false,
  setScore: createSetter<StoreType>(set)("score"),
  setFrame: createSetter<StoreType>(set)("frame"),
  setCollect: createSetter<StoreType>(set)("collect"),
  setUserPose: createSetter<StoreType>(set)("userPose"),
}));
