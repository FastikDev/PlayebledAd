import {
  _decorator,
  BoxColliderComponent,
  Component,
  instantiate,
  Material,
  MeshRenderer,
  Node,
  Prefab,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("ObjectGenerator")
export class ObjectGenerator extends Component {
  private static materialOrder: Material[] = [];
  private static holderObjects: Node[] = [];
  private static canObjects: Node[] = [];

  public static setRandomMaterial(
    materials: Material[],
    type: string,
    positions: Vec3[] = null
  ): Material[] {
    type === "can"
      ? (this.materialOrder = positions.reduce<Material[]>((acc) => {
          const shuffledMaterials = [...materials].sort(
            () => Math.random() - 0.5
          );

          return shuffledMaterials.reduce(
            (innerAcc, color) => innerAcc.concat([color, color, color]),
            acc
          );
        }, []))
      : (this.materialOrder = Array.from({ length: 2 }, () => {
          return materials[Math.floor(Math.random() * materials.length)];
        }));
    return this.materialOrder;
  }

  private static applyMaterial(
    newObject: Node,
    material: Material,
    type: string
  ) {
    const newNode =
      type === "can"
        ? newObject
            ?.getChildByName("Node")
            .getComponent(MeshRenderer)
            .setSharedMaterial(material, 0)
        : newObject
            ?.getChildByName("RootNode")
            .getChildByName("potion_holder")
            .getComponent(MeshRenderer)
            .setSharedMaterial(material, 0);
    return newNode;
  }

  private static createObject(
    position: Vec3,
    material: Material,
    scale: Vec3,
    rotation: Vec3,
    prefab: Prefab,
    type: string,
    parentNode: Node
  ) {
    const newObject = instantiate(prefab);

    newObject?.setScale(scale);
    newObject?.setPosition(position);

    this.applyMaterial(newObject, material, type);
    const collider = newObject?.addComponent(BoxColliderComponent);

    if (type === "holder") {
      newObject?.setRotationFromEuler(rotation);
      collider.size = new Vec3(1, 0.2, 0.3);
    } else {
      collider.size = new Vec3(0.3, 0.3, 0.3);
    }

    parentNode.addChild(newObject);

    type === "can"
      ? this.canObjects.push(newObject)
      : this.holderObjects.push(newObject);
  }

  public static generatorObject(
    positions: Vec3[],
    type: string,
    scale: Vec3,
    rotation: Vec3,
    prefab: Prefab,
    parentNode: Node
  ) {
    positions.map((position, index) => {
      type === "can"
        ? this.createObject(
            position,
            this.materialOrder[index % this.materialOrder.length],
            scale,
            rotation,
            prefab,
            type,
            parentNode
          )
        : this.createObject(
            position,
            this.materialOrder[index],
            scale,
            rotation,
            prefab,
            type,
            parentNode
          );
    });
  }

  public static getObjects(type: string): Node[] {
    return type === "can" ? this.canObjects : this.holderObjects;
  }
}

export default ObjectGenerator;
