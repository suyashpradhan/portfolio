// Tiny UI sounds, synthesised with Web Audio. No files to load, nothing to break.

export type SoundName = "tap" | "on" | "off" | "pop" | "open" | "tick";

let ctx: AudioContext | null = null;

export function soundEnabled(): boolean {
  try {
    return localStorage.getItem("sound") !== "off";
  } catch {
    return true;
  }
}

export function setSound(on: boolean) {
  try {
    localStorage.setItem("sound", on ? "on" : "off");
  } catch {}
  document.documentElement.dataset.sound = on ? "on" : "off";
}

function audio(): AudioContext | null {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

// One short note with a soft attack and exponential release.
function note(a: AudioContext, freq: number, start: number, dur: number, vol: number, type: OscillatorType = "sine", glideTo?: number) {
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(a.destination);
  o.start(start);
  o.stop(start + dur + 0.02);
}

export function play(name: SoundName, force = false) {
  if (!force && !soundEnabled()) return;
  const a = audio();
  if (!a) return;
  if (a.state === "suspended") a.resume();
  const t = a.currentTime + 0.005;
  switch (name) {
    case "tap": // link / button press
      note(a, 680, t, 0.06, 0.035, "sine", 420);
      break;
    case "tick": // moving through a list
      note(a, 1200, t, 0.025, 0.015, "triangle");
      break;
    case "pop": // copied
      note(a, 520, t, 0.09, 0.05, "sine", 1040);
      break;
    case "open": // palette opens
      note(a, 440, t, 0.12, 0.03, "triangle", 660);
      break;
    case "on": // light theme / sound on: rising pair
      note(a, 660, t, 0.12, 0.035, "triangle");
      note(a, 990, t + 0.07, 0.16, 0.03, "triangle");
      break;
    case "off": // dark theme / sound off: falling pair
      note(a, 660, t, 0.12, 0.035, "triangle");
      note(a, 440, t + 0.07, 0.18, 0.03, "triangle");
      break;
  }
}
