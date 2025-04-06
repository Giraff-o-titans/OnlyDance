import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "../hooks/useDriver";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";
import { Dance, PoseType } from "@/utils/types";
import useHTTP from "@/hooks/useHTTP";

import deadpool from "../../../data/deadpool.json";
import deadpoolAudio from "../assets/deadpool_audio.mp3";
import APT from "../../../data/APT.json";
import APTAudio from "../assets/APT_audio.mp3";

const Landing = () => {
  const [selectedDance, setSelectedDance] = useState<string | undefined>(undefined);
  const { poseData, setDance } = useStore();
  const navigate = useNavigate();
  const runApp = useDriver();
  const { http } = useHTTP();

  const poseDataMap: Record<string, Dance> = {
    deadpool: {
      poses: deadpool as PoseType[],
      audio: deadpoolAudio,
      bpm: 86.3,
    },
    APT: {
      poses: APT as PoseType[],
      audio: APTAudio,
      bpm: 74.5,
    },
  };

  const handleStart = async () => {
    const ok = await http({ url: "/health", method: "GET" });
    if (!ok) return toast.error("Server is not running!");

    if (!selectedDance) return toast.error("Please select a dance first!");
    setDance(poseDataMap[selectedDance]);

    setTimeout(() => {
      if (poseData && poseData.poses && poseData.poses.length > 0) {
        navigate("/app");
        runApp();
      } else {
        toast.error("Pose data is not loaded correctly.");
      }
    }, 100); // This gives time for the state update
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-4">
      <h1 className="flex p-4">
        <span className="gotham text-7xl">Only</span>
        <span className="marguerite text-red-500 text-6xl ml-4 mt-4">Dance</span>
      </h1>
      <Select value={selectedDance} onValueChange={setSelectedDance}>
        <SelectTrigger className="w-[300px] border-2 text-xl border-red-500">
          <SelectValue placeholder="Select a Dance" />
        </SelectTrigger>
        <SelectContent className="bg-white text-black shadow-md rounded-md">
          <SelectItem value="deadpool">Bye Bye Bye</SelectItem>
          <SelectItem value="APT">APT</SelectItem>
        </SelectContent>
      </Select>
      <Button
        className="bg-red-500 text-white text-3xl hover:cursor-pointer p-6 pb-7"
        onClick={handleStart}
      >
        Start
      </Button>
    </div>
  );
};

export default Landing;
