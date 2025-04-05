import { useEffect, useRef, useState } from 'react';
import { PoseType } from '../utils/types';

export function useFrameCycler(onFrames: number, offFrames: number, poses: PoseType[], audio: string) {
  const [frame, setFrame] = useState(0);
  const [active, setActive] = useState(true);
  const counter = useRef(0);
  const audioRef = useRef(new Audio(audio));

  useEffect(() => {
    const interval = setInterval(() => {
      if (active) {
        setFrame((prev) => (prev + 1) % poses.length);
        counter.current++;

        if (counter.current >= onFrames) {
          audioRef.current.pause();
          counter.current = 0;
          setActive(false);
        }
      } else {
        counter.current++;
        if (counter.current >= offFrames) {
          audioRef.current.play();
          counter.current = 0;
          setActive(true);
        }
      }
    }, 1000 / 30); // ~30 FPS

    return () => clearInterval(interval);
  }, [active, onFrames, offFrames, poses.length]);

  return frame;
}
