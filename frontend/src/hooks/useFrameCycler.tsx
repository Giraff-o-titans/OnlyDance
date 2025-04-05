import { useEffect, useRef, useState } from 'react';

export function useFrameCycler(onFrames: number, offFrames: number, maxFrame: number) {
  const [frame, setFrame] = useState(0);
  const [active, setActive] = useState(true);
  const counter = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (active) {
        setFrame((prev) => (prev + 1) % maxFrame);
        counter.current++;

        if (counter.current >= onFrames) {
          counter.current = 0;
          setActive(false);
        }
      } else {
        counter.current++;
        if (counter.current >= offFrames) {
          counter.current = 0;
          setActive(true);
        }
      }
    }, 33); // ~30 FPS

    return () => clearInterval(interval);
  }, [active, onFrames, offFrames, maxFrame]);

  return frame;
}
