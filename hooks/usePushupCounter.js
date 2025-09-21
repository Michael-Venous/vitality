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

export function usePushupCounter(keypoints) {
  const [count, setCount] = useState(0);
  const phase = useRef("up");

  useEffect(() => {
    if (!keypoints || keypoints.length === 0) return;

    const leftShoulder = keypoints.find((kp) => kp.name === `left_shoulder`);
    const leftElbow = keypoints.find((kp) => kp.name === `left_elbow`);
    const leftWrist = keypoints.find((kp) => kp.name === `left_wrist`);
    const rightShoulder = keypoints.find((kp) => kp.name === `right_shoulder`);
    const rightElbow = keypoints.find((kp) => kp.name === `right_elbow`);
    const rightWrist = keypoints.find((kp) => kp.name === `right_wrist`);

    const leftHip = keypoints.find((kp) => kp.name === "left_hip");
    const rightHip = keypoints.find((kp) => kp.name === "right_hip");

    // check for plank position
    const shoulderY = (leftShoulder?.y + rightShoulder?.y) / 2;
    const hipY = (leftHip?.y + rightHip?.y) / 2;

    if (!shoulderY || !hipY) return;

    const isPlankPosition = Math.abs(shoulderY - hipY) > 0.1;

    // check elbow angles
    const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const angle = Math.min(leftAngle || 180, rightAngle || 180);

    if (angle === 180) return;

    if (phase.current === "up" && angle < 110 && isPlankPosition) {
      phase.current = "down";
    } else if (phase.current === "down" && angle > 150) {
      const leftWristAboveElbow = leftWrist?.x >= leftElbow?.x;
      const rightWristAboveElbow = rightWrist?.x >= rightElbow?.x;
      console.log("gud");
      // only activates if wrists are detected and above elbows to avoid false positives
      if (!leftWristAboveElbow || !rightWristAboveElbow) {
        console.log("gud.,kl;kl;okl");
        setCount((c) => c + 1);
        phase.current = "up";
      }
    }
  }, [keypoints]);

  return count;
}
