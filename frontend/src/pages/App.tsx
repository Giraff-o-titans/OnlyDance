import { useStore } from "@/hooks/useStore";
import PoseCamera from "../components/PoseCamera";
import Scene from "../components/Scene";
import ScatterPlot from "@/components/Scatter";

function App() {
  const { centerText } = useStore();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex">
        <div className="w-[50vw] h-[calc(3/4*50vw)]">
          <Scene />
        </div>
        <PoseCamera />
      </div>
      <div className="flex items-center">
        <span className="flex-1 text-[5vw] z-50 text-center mario text-red-500 drop-shadow-[3px_3px_0_#000] font-bold">
          {centerText}
        </span>
        <ScatterPlot />
      </div>
    </div>
  );
}

export default App;
