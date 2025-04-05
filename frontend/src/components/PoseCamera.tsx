import { useRef, useEffect } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";

export default function PoseCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let camera: cam.Camera | null = null;

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx || !results.poseLandmarks) return;

      const landmarks = results.poseLandmarks;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw lines between connected keypoints
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      for (const [startIdx, endIdx] of POSE_CONNECTIONS) {
        const start = landmarks[startIdx];
        const end = landmarks[endIdx];
        ctx.beginPath();
        ctx.moveTo(start.x * canvasRef.current.width, start.y * canvasRef.current.height);
        ctx.lineTo(end.x * canvasRef.current.width, end.y * canvasRef.current.height);
        ctx.stroke();
      }

      // Draw landmarks
      for (const landmark of landmarks) {
        ctx.beginPath();
        ctx.arc(
          landmark.x * canvasRef.current.width,
          landmark.y * canvasRef.current.height,
          5,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });

    if (videoRef.current) {
      camera = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await pose.send({ image: videoRef.current });
          }
        },
        width: 480,
        height: 640,
      });
      camera.start();
    }
  }, []);

  return (
    <div style={{ position: "relative" }} className="h-screen">
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        width={480}
        height={640}
        style={{ position: "absolute", top: 0, left: 0 }}
        className="h-screen"
      />
    </div>
  );
}
