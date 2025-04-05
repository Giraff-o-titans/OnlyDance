import PoseCamera from "./components/PoseCamera";
import Scene from "./components/Scene";

function App() {
  return (
    <div className="h-screen flex">
      <div className="w-[50vw] h-[calc(3/4*50vw)]">
        <Scene />
      </div>
      <PoseCamera />
    </div>
  );
}

export default App;
