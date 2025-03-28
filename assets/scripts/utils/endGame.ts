import { _decorator, Component, Node, director, Label } from "cc";
const { ccclass } = _decorator;
import { AudioManager } from "./AudioManager";

@ccclass("endGame")
export class endGame extends Component {
  public static startTimer(
    timerLabel: Label,
    interval,
    timer: number,
    gameOver: Node,
    updateTimerCallback: Function
  ) {
    interval = setInterval(() => {
      timer--;
      if (timer <= 5 && timer > 0) {
        AudioManager.instance.playOneShot("timeout");
      }

      if (timer === 0) {
        this.endGame(interval, gameOver, timerLabel);
      }
      updateTimerCallback(timer);
    }, 1000);
  }

  private static endGame(interval, gameOver: Node, timerLabel: Label) {
    AudioManager.instance.pauseAudio();
    director.pause();

    if (gameOver) {
      gameOver.active = true;
      timerLabel.enabled = false;
    }
    clearInterval(interval);
  }
}
