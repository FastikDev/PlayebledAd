import { Node, tween, Prefab } from "cc";
import * as holder from "../config/holders";
import { checkColors } from "../utils/checkColors";
import { moveCans } from "./canEvents";
import { movedOffScreeen } from "./movedOffScreen";
import { AudioManager } from "../utils/AudioManager";
import ObjectGenerator from "../utils/ObjectGenerator";

export function moveHolder(
  node: Node,
  canNodes: Node[],
  index: number,
  duration: number = 1,
  holderNodes: Node[],
  prefab: Prefab,
  parentNode: Node,
  updateHolderNodes: (newHolderNodes: Node[]) => void,
  gameOver: Node
) {
  if (!node || !node.isValid) {
    return;
  }
  const currentPosition = node.position.clone();
  const targetPosition = holder.newPositions[index];
  const targetRotation = holder.newRotation;
  const targetScale = holder.NewScale;

  AudioManager.instance.playOneShot("click");

  tween(node)
    .to(
      duration,
      {
        position: targetPosition,
        eulerAngles: targetRotation,
        scale: targetScale,
      },
      { easing: "sineInOut" }
    )
    .call(() => {
      if (checkColors(node, canNodes, index)) {
        AudioManager.instance.playOneShot("canMoveSound");
        moveCans(canNodes, index, duration, () => {
          setTimeout(() => {
            movedOffScreeen(node, duration);
            AudioManager.instance.playOneShot("drop");
            setTimeout(() => {
              if (node.isValid) {
                node.removeFromParent();
                node.destroy();
              }
            }, duration * 1000);

            setTimeout(() => {
              ObjectGenerator.generatorObject(
                [currentPosition],
                "holder",
                holder.scale,
                holder.rotation,
                prefab,
                parentNode
              );

              const updatedHolders = ObjectGenerator.getObjects("holder");

              if (!updatedHolders || updateHolderNodes.length === 0) {
                return;
              }
              const newHolderNodes = [...holderNodes];
              newHolderNodes[index] = updatedHolders[updatedHolders.length - 1];
              updateHolderNodes(newHolderNodes);
            }, duration * 1200);
          }, duration * 1000);
        });
      } else {
        AudioManager.instance.playOneShot("error");
      }
    })
    .start();
}
