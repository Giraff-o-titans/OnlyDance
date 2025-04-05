import PoseCamera from "./components/PoseCamera";
import Scene from "./components/Scene";

function App() {
  return (
    <div className="h-screen flex flex">
      <div className="w-1/2">
        <Scene />
      </div>
      <PoseCamera />
    </div>
  );
}

export default App;
