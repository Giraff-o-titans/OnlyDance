import { useStore } from "@/hooks/useStore";

const CenterText = () => {
  const { centerText } = useStore();

  return (
    <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen">
      <div className="text-[10vw] z-50 text-center mario text-red-500 drop-shadow-[3px_3px_0_#000] font-bold">
        {centerText}
      </div>
    </div>
  );
};

export default CenterText;
