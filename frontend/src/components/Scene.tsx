import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import poses from "../../../data/pose_data.json";
import { useEffect, useState } from "react";
import Model from "./Model";

export default function Scene() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % poses.length);
    }, 33);

    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
      <ambientLight intensity={1} />
      <Model pose={poses[frame]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}
