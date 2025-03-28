import { _decorator, Component, AudioClip, AudioSource } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager extends Component {
  private static _instance: AudioManager;
  private audioSource: AudioSource;
  private soundMap: Map<string, AudioClip> = new Map();
  private playingSound: Set<string> = new Set();
  private isPaused: boolean = false;

  @property([AudioClip])
  audioClips: AudioClip[] = [];

  onLoad() {
    if (AudioManager._instance) {
      this.destroy();
      return;
    }

    AudioManager._instance = this;
    this.audioSource = this.node.addComponent(AudioSource);
  }

  start() {
    if (!this.audioClips || this.audioClips.length === 0) {
      return;
    }

    this.audioClips.forEach((clip) => {
      if (clip && !this.soundMap.has(clip.name)) {
        this.soundMap.set(clip.name, clip);
      }
    });
  }

  public static get instance(): AudioManager {
    return AudioManager._instance;
  }

  public pauseAudio() {
    this.isPaused = true;
    this.stopAllSound();
  }

  public playOneShot(name: string) {
    if (this.isPaused) {
      return;
    }

    if (this.playingSound.has(name)) {
      return;
    }

    const clip = this.soundMap.get(name);
    if (!clip) {
      return;
    }

    this.audioSource.playOneShot(clip);
    this.playingSound.add(name);

    setTimeout(() => {
      this.playingSound.delete(name);
    }, clip.getDuration() * 1000);
  }

  public stopAllSound() {
    this.audioSource.stop();
    this.playingSound.clear();
  }
}
