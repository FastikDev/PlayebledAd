import { Node, tween, Vec3 } from "cc";

export function movedOffScreeen(node: Node, duration: number) {
  const currentPos = node.position;
  const offScreenPos = new Vec3(currentPos.x, currentPos.y, currentPos.z + 50);
  setTimeout(() => {
    tween(node).to(duration, { position: offScreenPos }).start();
  }, duration * 1000);
}
