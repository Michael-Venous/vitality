import { useEffect, useRef, useState } from "react";

function calculateAngle(a, b, c) {
  if (!a || !b || !c) return null;

  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
}

const SQUAT_THRESHOLD = 120;
const STAND_THRESHOLD = 160;

export function useSquatCounter(keypoints) {
  const [count, setCount] = useState(0);
  const phase = useRef("up");

  useEffect(() => {
    if (!keypoints || keypoints.length === 0) return;

    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
    const leftHip = keypoints.find((kp) => kp.name === "left_hip");
    const leftKnee = keypoints.find((kp) => kp.name === "left_knee");

    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
    const rightHip = keypoints.find((kp) => kp.name === "right_hip");
    const rightKnee = keypoints.find((kp) => kp.name === "right_knee");

    const leftAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    const isDown =
      (leftAngle && leftAngle < SQUAT_THRESHOLD) ||
      (rightAngle && rightAngle < SQUAT_THRESHOLD);

    const isUp =
      (!leftAngle || leftAngle > STAND_THRESHOLD) &&
      (!rightAngle || rightAngle > STAND_THRESHOLD);

    if (phase.current === "up" && isDown) {
      phase.current = "down";
    } else if (phase.current === "down" && isUp) {
      setCount((c) => c + 1);
      phase.current = "up";
    }
  }, [keypoints]);

  return count;
}
