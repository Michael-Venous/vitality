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

const SITUP_UP_THRESHOLD = 90;
const SITUP_DOWN_THRESHOLD = 100;

export function useSitupCounter(keypoints) {
  const [count, setCount] = useState(0);
  const phase = useRef("down");
  const isLyingDown = useRef(false);

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

    // check for lie down position
    const avgHipY = (leftHip?.y + rightHip?.y) / 2;
    const avgKneeY = (leftKnee?.y + rightKnee?.y) / 2;
    const isOnTheGround = avgHipY && avgKneeY ? avgKneeY > avgHipY : false;
    if (!isOnTheGround) return;
    // waits until user first lies down
    if (!isLyingDown.current) {
      if (isOnTheGround) {
        isLyingDown.current = true;
      }
      return;
    }

    const angle = Math.min(leftAngle || 180, rightAngle || 180);
    if (angle === 180) return; // returns if no angle detected

    if (phase.current === "down" && angle < SITUP_UP_THRESHOLD) {
      phase.current = "up";
    } else if (phase.current === "up" && angle > SITUP_DOWN_THRESHOLD) {
      setCount((c) => c + 1);
      console.log("situp" + count);
      phase.current = "down";
    }
  }, [keypoints]);

  return count;
}
