import { useEffect, useState } from "react";

// Helper: angle between three points (A-B-C, where B is the joint)
function getAngle(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
  const angle = Math.acos(dot / (magAB * magCB));
  return (angle * 180) / Math.PI; // degrees
}

/**
 * Count reps based on elbow flexion/extension.
 * @param keypoints Pose keypoints array
 * @param side "left" or "right" elbow to track
 */
export function useElbowCounter(keypoints, side = "left") {
  const [reps, setReps] = useState(0);
  const [phase, setPhase] = useState("up"); // "up" | "down"

  useEffect(() => {
    if (!keypoints || keypoints.length === 0) return;

    const shoulder = keypoints.find((k) => k.name === `${side}_shoulder`);
    const elbow = keypoints.find((k) => k.name === `${side}_elbow`);
    const wrist = keypoints.find((k) => k.name === `${side}_wrist`);

    if (!shoulder || !elbow || !wrist) return;

    const angle = getAngle(shoulder, elbow, wrist);

    // Thresholds depend on the exercise:
    // Pushups: bent (~70–90°) vs extended (~160–180°)
    const downThreshold = 90; // elbow bent
    const upThreshold = 160; // elbow extended

    if (phase === "up" && angle < downThreshold) {
      setPhase("down");
    } else if (phase === "down" && angle > upThreshold) {
      setPhase("up");
      setReps((prev) => prev + 1);
    }
    console.log("Elbow angle:", angle);
  }, [keypoints, phase, side]);

  return reps;
}
