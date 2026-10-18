import { audioEngine } from './AudioEngine';

export const sfx = {
  tick: (pan) => audioEngine.playTick(pan),
  pop: (pitch, pan) => audioEngine.playPop(pitch, pan),
  whoosh: (dir) => audioEngine.playWhoosh(dir),
  slideSwitch: (dir) => audioEngine.slideSwitch(dir),
  spark: () => audioEngine.playSpark(),
  chime: () => audioEngine.playChime(),
  buzz: () => audioEngine.playBuzz(),
  riser: (dur) => audioEngine.playRiser(dur),
  chemicalFizz: (dur) => audioEngine.chemicalFizz(dur),
  sonarPing: (pan) => audioEngine.sonarPing(pan),
  startRain: () => audioEngine.startRainLoop(),
  stopRain: () => audioEngine.stopRainLoop(),
  unlock: () => audioEngine.unlock(),
  setVolume: (v) => audioEngine.setVolume(v),
  setMuted: (m) => audioEngine.setMuted(m),
};

export default sfx;
