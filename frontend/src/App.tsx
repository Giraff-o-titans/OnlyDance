import { useState, useRef, useEffect } from "react";
import PoseCamera from "./components/PoseCamera";
import Scene from "./components/Scene";
import { useStore } from "./hooks/useStore";

function App() {
  const { setCollect, userPose, setUserPose } = useStore();
  const userPoseRef = useRef(userPose);

  useEffect(() => {
    userPoseRef.current = userPose;
  }, [userPose]);

  const collectCycle = async (timeMS: number) => {
    setUserPose([]);
    setCollect(true);
    setTimeout(() => {
      setCollect(false);
      console.log(userPoseRef.current); // 👈 this is the correct value
    }, timeMS);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex">
        <div className="w-[50vw] h-[calc(3/4*50vw)]">
          <Scene />
        </div>
        <PoseCamera />
      </div>
      <button onClick={() => collectCycle(1000)}>Collect</button>
    </div>
  );
}

export default App;
