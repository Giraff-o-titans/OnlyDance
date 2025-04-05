import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import poses from "../../../data/pose_data.json";
import { useFrameCycler } from "../hooks/useFrameCycler";
import Model from "./Model";

export default function Scene() {
  const BPM = 86.3;
  const FPB = 60 * 30 / BPM;
  const frame = useFrameCycler(FPB, FPB * 4, poses.length);

  return (
    <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
      <ambientLight intensity={1} />
      <Model pose={poses[frame]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}
