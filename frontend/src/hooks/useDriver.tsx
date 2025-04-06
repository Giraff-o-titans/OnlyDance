import { useStore } from "./useStore";
import { useRef, useEffect } from "react";
import audio from "../assets/deadpool_audio.mp3";
import useHTTP from "./useHTTP";
import { data } from "react-router-dom";

export function useDriver() {
  const BPM = 86.3;
  const FPS = 30;
  const startFrame = 0;
  const FPM = (60 * 30 * 4) / BPM;
  const { http } = useHTTP();
  const audioRef = useRef(new Audio(audio));
  const { poseData, setFrame, setCenterText } = useStore();
  let numFrames = poseData?.[poseData.length - 1]?.frame ?? 0;

  const { setCollect, userPose, setUserPose } = useStore();
  const userPoseRef = useRef(userPose);

  useEffect(() => {
    userPoseRef.current = userPose;
  }, [userPose]);

  useEffect(() => {
    numFrames = poseData?.[poseData.length - 1]?.frame ?? 0;
  }, [poseData]);

  const collectAndScore = async (timeMS: number, measure: number): Promise<number> => {
    return new Promise((resolve) => {
      setUserPose([]);
      setCollect(true);
      setTimeout(() => {
        setCollect(false);
        // console.log(userPoseRef.current);

        const start = Math.round(startFrame + measure * FPM);
        const end = Math.min(numFrames, Math.round(start + FPM));

        http({
          url: "/score",
          method: "POST",
          body: { actual: userPoseRef.current, expected: poseData.slice(start, end) },
          handleData: (data) => resolve(data.score),
        });
      }, timeMS);
    });
  };

  const scoreUser = async () => {
    setCenterText("Your Turn");
    const score = await collectAndScore((4 * 60 * 1000) / BPM, 0);
    setCenterText("Score: " + score.toFixed(2));
    return score;
  };

  const playFrames = async (startFrame: number, endFrame: number) => {
    for (let i = startFrame; i < endFrame; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000 / FPS));
      setFrame(i);
    }
  };

  const countdown = async (seconds: number) => {
    return new Promise<void>((resolve) => {
      let count = seconds;
      setCenterText(count.toString());

      const interval = setInterval(() => {
        setCenterText((--count).toString());

        if (count < 0) {
          clearInterval(interval);
          setCenterText("");
          resolve();
        }
      }, 1000);
    });
  };

  const runApp = async () => {
    await countdown(3);
    await new Promise((res) => setTimeout(res, 500));

    for (let measure = 0; measure < Math.ceil(numFrames / FPM); measure++) {
      do {
        const start = Math.round(startFrame + measure * FPM);
        const end = Math.min(numFrames, Math.round(start + FPM));
        // const startTime = poses[poses.findIndex((p) => p.frame === start)].timestamp;
        // const endTime = poses[poses.findIndex((p) => p.frame === end)].timestamp;

        // if (!audioRef.current) return;
        // audioRef.current.currentTime = startTime;
        // audioRef.current.play();
        // setTimeout(() => {
        //   audioRef.current.pause();
        // }, (endTime - startTime) * 1000);

        await playFrames(start, end);
      } while ((await scoreUser()) < 50);
    }
  };

  return runApp;
}
