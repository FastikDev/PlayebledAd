import { Node, PhysicsSystem, geometry } from "cc";

export function getHitNode(
  ray: geometry.Ray,
  targetNodes: Node[]
): Node | null {
  if (PhysicsSystem.instance.raycast(ray)) {
    return (
      PhysicsSystem.instance.raycastResults
        .map((result) => result.collider.node)
        .find((node) => targetNodes.indexOf(node) !== -1) || null
    );
  }
  return null;
}
