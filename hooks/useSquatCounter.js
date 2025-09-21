import { useEffect, useRef, useState } from "react";

function calculateAngle(a, b, c) {
  if (!a || !b || !c) return null;

  const vectorBA = { x: a.x - b.x, y: a.y - b.y };
  const vectorBC = { x: c.x - b.x, y: c.y - b.y };

  const dotProduct = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y;

  const magnitudeBA = Math.sqrt(vectorBA.x ** 2 + vectorBA.y ** 2);
  const magnitudeBC = Math.sqrt(vectorBC.x ** 2 + vectorBC.y ** 2);

  if (magnitudeBA === 0 || magnitudeBC === 0) return null;

  let cosine = dotProduct / (magnitudeBA * magnitudeBC);

  cosine = Math.max(-1, Math.min(1, cosine));

  const angle = Math.acos(cosine) * (180 / Math.PI);

  return angle;
}

const HIP_SQUAT_THRESHOLD = 90;
const KNEE_SQUAT_THRESHOLD = 90;

const HIP_STAND_THRESHOLD = 160;
const KNEE_STAND_THRESHOLD = 160;

export function useSquatCounter(keypoints) {
  const [count, setCount] = useState(0);
  const phase = useRef("up");

  useEffect(() => {
    if (!keypoints || keypoints.length === 0) return;

    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
    const leftHip = keypoints.find((kp) => kp.name === "left_hip");
    const leftKnee = keypoints.find((kp) => kp.name === "left_knee");
    const leftAnkle = keypoints.find((kp) => kp.name === "left_ankle");

    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
    const rightHip = keypoints.find((kp) => kp.name === "right_hip");
    const rightKnee = keypoints.find((kp) => kp.name === "right_knee");
    const rightAnkle = keypoints.find((kp) => kp.name === "right_ankle");

    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

    // check if angles exist
    if (
      (leftHipAngle === null && rightHipAngle === null) ||
      (leftKneeAngle === null && rightKneeAngle === null)
    )
      return;

    const hipAngle = Math.min(leftHipAngle || 180, rightHipAngle || 180);
    const kneeAngle = Math.min(leftKneeAngle || 180, rightKneeAngle || 180);

    const isDown =
      hipAngle &&
      kneeAngle &&
      hipAngle < HIP_SQUAT_THRESHOLD &&
      kneeAngle < KNEE_SQUAT_THRESHOLD;

    const isUp =
      hipAngle &&
      kneeAngle &&
      hipAngle > HIP_STAND_THRESHOLD &&
      kneeAngle > KNEE_STAND_THRESHOLD;

    if (phase.current === "up" && isDown) {
      phase.current = "down";
    } else if (phase.current === "down" && isUp) {
      setCount((prevCount) => prevCount + 1);
      phase.current = "up";
    }
  }, [keypoints]);

  return count;
}
