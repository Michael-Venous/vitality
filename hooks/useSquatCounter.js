import { useState, useEffect } from "react";

// Helper: calculate angle between 3 points (A-B-C, in degrees)
function getAngle(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
  const angle = Math.acos(dot / (magAB * magCB));
  return (angle * 180) / Math.PI;
}

export function useSquatCounter(keypoints) {
  const [reps, setReps] = useState(0);
  const [phase, setPhase] = useState("up"); // "up" | "down"

  useEffect(() => {
    if (!keypoints || keypoints.length === 0) return;

    const hip = keypoints.find((k) => k.name === "left_hip");
    const knee = keypoints.find((k) => k.name === "left_knee");
    const ankle = keypoints.find((k) => k.name === "left_ankle");

    if (!hip || !knee || !ankle) return;

    const angle = getAngle(hip, knee, ankle); // knee angle

    // Simple thresholds
    const downThreshold = 70;  // deep squat
    const upThreshold = 160;   // standing

    if (phase === "up" && angle < downThreshold) {
      setPhase("down");
    } else if (phase === "down" && angle > upThreshold) {
      setPhase("up");
      setReps((prev) => prev + 1);
    }
  }, [keypoints, phase]);

  return reps;
}

