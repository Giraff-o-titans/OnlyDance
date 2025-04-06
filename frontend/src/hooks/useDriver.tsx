import { useStore } from "./useStore";
import { useRef, useEffect } from "react";
import useHTTP from "./useHTTP";
import { sleep } from "@/utils/functions";
import { SCORE_THRESHOLD } from "@/utils/types";

export function useDriver() {
  const BPM = 86.3;
  const FPS = 30;
  const startFrame = 0;
  const FPM = (60 * 30 * 4) / BPM;
  const { http } = useHTTP();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { poseData, setFrame, setCenterText, setScorePoints } = useStore();
  let numFrames = 0;

  const { setCollect, setUserPose, userPoseRef } = useStore();

  useEffect(() => {
    if (poseData?.poses && poseData.poses.length > 0) {
      numFrames = poseData.poses[poseData.poses.length - 1].frame;
    } else {
      numFrames = 0;
    }
  
    audioRef.current = poseData?.audio ? new Audio(poseData.audio) : null;
  }, [poseData]);

  const collectAndScore = async (timeMS: number, measure: number): Promise<number> => {
    return new Promise((resolve) => {
      setUserPose([]);
      setCollect(true);
      setTimeout(() => {
        setCollect(false);
        
        const start = Math.round(startFrame + measure * FPM);
        const end = Math.min(numFrames, Math.round(start + FPM));
        console.log(userPoseRef.current);

        http({
          url: "/score",
          method: "POST",
          body: { actual: userPoseRef.current, expected: poseData.poses.slice(start, end) },
          handleData: (data) => resolve(data.score),
        });
      }, timeMS);
    });
  };

  const scoreUser = async (measure: number) => {
    setCenterText("Your Turn");
    // playAudio(start, end);
    const score = await collectAndScore(3 * (4 * 60 * 1000) / BPM, 0);
    setScorePoints((prev) => [...prev, { measure, score }]);
    setCenterText("Score: " + score.toFixed(2));
    return score;
  };

  const playFrames = async (startFrame: number, endFrame: number) => {
    for (let i = startFrame; i < endFrame; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000 / FPS));
      setFrame(i);
    }
  };

  const playAudio = (startFrame: number, endFrame: number) => {
    if (!audioRef.current) return;
    const poses = poseData.poses;
    const startTime = poses[poses.findIndex((p) => p.frame === startFrame)].timestamp;
    const endTime = poses[poses.findIndex((p) => p.frame === endFrame)].timestamp;

    audioRef.current.currentTime = startTime;
    audioRef.current.play();
    setTimeout(() => {
      audioRef.current?.pause();
    }, (endTime - startTime) * 1000);
  };

  const countdown = async (seconds: number) => {
    return new Promise<void>((resolve) => {
      let count = seconds;
      setCenterText(count.toString());

      const interval = setInterval(() => {
        setCenterText((--count).toString());

        if (count <= 0) {
          clearInterval(interval);
          setCenterText("");
          resolve();
        }
      }, 1000);
    });
  };

  const runApp = async () => {
    await countdown(3);
    await sleep(500);

    for (let measure = 0; measure < Math.ceil(numFrames / FPM); measure++) {
      let start = 0;
      let end = 0;
      do {
        start = Math.round(startFrame + measure * FPM);
        end = Math.min(numFrames, Math.round(start + FPM));
        playAudio(start, end);
        await playFrames(start, end);
      } while ((await scoreUser(measure)) < SCORE_THRESHOLD);
    }
  };

  return runApp;
}
