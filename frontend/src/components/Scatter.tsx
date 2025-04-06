import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent } from "./ui/card";
import { useStore } from "@/hooks/useStore";
import { SCORE_THRESHOLD } from "@/utils/types";

export default function ScatterPlot() {
  const { scorePoints: data } = useStore();

  return (
    <Card className="flex-1 w-full shadow-md">
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="measure"
              name="Measure"
              label={{
                value: "Measure",
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis
              type="number"
              dataKey="score"
              name="Score"
              domain={[0, 100]}
              label={{
                value: "Score",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <ReferenceLine
              y={SCORE_THRESHOLD}
              stroke="red"
              strokeDasharray="4 4"
              label={{
                value: `Threshold (${SCORE_THRESHOLD})`,
                position: "right",
                fill: "red",
                fontSize: 12,
              }}
            />
            <Scatter name="Performance" data={data} fill="#6366f1" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
