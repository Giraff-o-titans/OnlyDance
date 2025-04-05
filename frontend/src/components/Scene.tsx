import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import poses from "../../../data/pose_data.json";
import { useStore } from "../hooks/useStore";

export default function Scene() {
  const BPM = 86.3;
  const FPS = 30;
  const FPB = 60 * 30 / BPM;

  const { frame, setFrame } = useStore();

  const play = async (startFrame: number, endFrame: number) => {
    for (let i = startFrame; i < endFrame; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000 / FPS));
      setFrame(i);
    }
  }

  return (
    <Canvas camera={{ position: [0, 0, 2], fov: 60 }}>
      <ambientLight intensity={1} />
      <Model pose={poses[frame]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}
