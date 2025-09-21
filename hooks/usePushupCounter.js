import { useEffect, useRef, useState } from "react";

export function usePushupCounter(keypoints) {
  const [count, setCount] = useState(0);
  const phase = useRef("up");

  const getAngle = (a, b, c) => {
    if (!a || !b || !c) return null;
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
    const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
    if (magAB === 0 || magCB === 0) return null;
    const cosine = dot / (magAB * magCB);
    return Math.acos(Math.min(Math.max(cosine, -1), 1)) * (180 / Math.PI);
  };

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
    const leftAngle = getAngle(leftShoulder, leftElbow, leftWrist);
    const rightAngle = getAngle(rightShoulder, rightElbow, rightWrist);
    const angle = Math.min(leftAngle || 180, rightAngle || 180);

    if (angle === 180) return;

    if (phase.current === "up" && angle < 110 && isPlankPosition) {
      phase.current = "down";
    } else if (phase.current === "down" && angle > 150) {
      const leftWristAboveElbow = leftWrist?.x >= leftElbow?.x;
      const rightWristAboveElbow = rightWrist?.x >= rightElbow?.x;
      console.log("gud");
      if (!leftWristAboveElbow || !rightWristAboveElbow) {
        console.log("gud.,kl;kl;okl");
        setCount((c) => c + 1);
        phase.current = "up";
      }
      // check if wrists are below elbows
    }
  }, [keypoints]);

  return count;
}
