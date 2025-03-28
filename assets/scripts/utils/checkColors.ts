import { Node, MeshRenderer } from "cc";
import * as holder from "../config/holders";

function getMaterial(node: Node, type: string): string | null {
  let mesh: MeshRenderer = null;

  if (type === "holder") {
    mesh = node
      ?.getChildByName("RootNode")
      .getChildByName("potion_holder")
      .getComponent(MeshRenderer);
  } else {
    mesh = node?.getChildByName("Node").getComponent(MeshRenderer);
  }

  if (mesh && mesh.materials.length > 0) {
    return mesh?.materials[0].getProperty("mainColor").toString();
  }

  return null;
}

export function checkColors(
  holderNode: Node,
  canNodes: Node[],
  index: number
): boolean {
  if (holderNode.getPosition().equals(holder.newPositions[index])) {
    const holderMaterial = getMaterial(holderNode, "holder");
    const canMaterial = getMaterial(canNodes[canNodes.length - 1], "can");

    const isSimilar = holderMaterial === canMaterial;
    return isSimilar;
  }
}
