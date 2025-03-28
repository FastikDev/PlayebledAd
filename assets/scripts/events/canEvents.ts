import { Node, tween } from "cc";
import * as can from "../config/cans";
import { movedOffScreeen } from "./movedOffScreen";
import { AudioManager } from "../utils/AudioManager";

export function moveCans(
  canNodes: Node[],
  index: number,
  duration: number,
  callback: Function
) {
  const movedCans: Node[] = [];
  const newPos = can.newPositions[index];

  movedCans.push(...canNodes.splice(-3, 3));

  movedCans.map((can) => tween(can).stop());

  canNodes.map((targetCan, i) => {
    const newIndex = i + (156 - canNodes.length);
    tween(targetCan)
      .to(duration, { position: can.positions[newIndex] })
      .start();
    AudioManager.instance.playOneShot("slideCan");
  });

  let animationsCompleted = 0;
  movedCans.map((targetCan, i) => {
    if (newPos[i]) {
      tween(targetCan)
        .to(duration, { position: newPos[i] })
        .call(() => {
          animationsCompleted++;
          if (animationsCompleted === movedCans.length) {
            setTimeout(() => callback(), 100);
          }
        })
        .start();
      AudioManager.instance.playOneShot("canMoveSound");
    }
  });

  setTimeout(() => {
    movedCans.map((can) => movedOffScreeen(can, duration));
  }, duration * 1000);

  setTimeout(() => {
    movedCans.map((can) => {
      if (can.isValid) can.destroy();
      AudioManager.instance.playOneShot("drop");
    });
  }, duration * 2000);
}
