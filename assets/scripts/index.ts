import {
  _decorator,
  Component,
  Material,
  Node,
  Prefab,
  Camera,
  input,
  Input,
  EventTouch,
  Label,
  geometry,
} from "cc";
import ObjectGenerator from "./utils/ObjectGenerator";
import * as can from "./config/cans";
import * as holder from "./config/holders";
import { getHitNode } from "./utils/raycastUtils";
import { moveHolder } from "./events/holderEvents";
import { endGame } from "./utils/endGame";

const { ccclass, property } = _decorator;

@ccclass("index_js")
export class index_js extends Component {
  @property(Node)
  gameOverScreen: Node = null;

  @property(Prefab)
  canPrefab: Prefab = null;

  @property(Prefab)
  holderPrefab: Prefab = null;

  @property([Material])
  materials: Material[] = [];

  @property(Camera)
  readonly cameraCom!: Camera;

  @property(Label)
  timerLabel: Label = null;

  private _ray: geometry.Ray = new geometry.Ray();
  private holderNodes: Node[] = [];
  private canNodes: Node[] = [];

  private gameTimer: number = 60;
  private TimeInterval: any = null;

  onLoad() {
    ObjectGenerator.setRandomMaterial(this.materials, "can", can.positions);
    ObjectGenerator.generatorObject(
      can.positions,
      "can",
      can.scale,
      can.rotation,
      this.canPrefab,
      this.node
    );

    ObjectGenerator.setRandomMaterial(
      this.materials,
      "holder",
      holder.positions
    );
    ObjectGenerator.generatorObject(
      holder.positions,
      "holder",
      holder.scale,
      holder.rotation,
      this.holderPrefab,
      this.node
    );

    this.holderNodes = ObjectGenerator.getObjects("holder");
    this.canNodes = ObjectGenerator.getObjects("can");
  }

  onEnable() {
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
  }

  onDisable() {
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
  }

  start() {
    this.updateTimer(this.gameTimer);
    endGame.startTimer(
      this.timerLabel,
      this.TimeInterval,
      this.gameTimer,
      this.gameOverScreen,
      this.updateTimer.bind(this)
    );
  }

  onTouchStart(event: EventTouch) {
    const touch = event.touch!;

    this.cameraCom.screenPointToRay(
      touch.getLocationX(),
      touch.getLocationY(),
      this._ray
    );

    const hitNode = getHitNode(this._ray, this.holderNodes);

    if (!hitNode || !hitNode.isValid) {
      return;
    }
    const index = this.holderNodes.indexOf(hitNode);
    if (index === -1 || !holder.newPositions[index]) {
      return;
    }
    moveHolder(
      hitNode,
      this.canNodes,
      index,
      0.3,
      this.holderNodes,
      this.holderPrefab,
      this.node,
      (newHolderNodes) => {
        this.holderNodes = newHolderNodes;
      },
      this.gameOverScreen
    );
  }

  updateTimer(timer: number) {
    if (this.timerLabel) {
      this.timerLabel.string = `${this.gameTimer}s`;
    }
    this.gameTimer = timer;
  }
}
