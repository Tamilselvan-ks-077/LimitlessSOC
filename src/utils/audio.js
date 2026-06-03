let audioCtx = null;
let soundEnabled = true;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const toggleSound = (state) => {
  soundEnabled = state;
  if (state) {
    try {
      initAudio();
    } catch (e) {
      console.warn("Audio init failed:", e);
    }
  }
};

export const isSoundEnabled = () => soundEnabled;

const playTone = (freq, type, duration, volume = 0.1, sweepFreq = null) => {
  if (!soundEnabled) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (sweepFreq) {
      osc.frequency.exponentialRampToValueAtTime(sweepFreq, audioCtx.currentTime + duration);
    }
    
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio playback failed:", e);
  }
};

export const playHover = () => playTone(900, 'sine', 0.04, 0.02, 1200);
export const playClick = () => playTone(600, 'triangle', 0.08, 0.08, 150);
export const playSuccess = () => {
  if (!soundEnabled) return;
  playTone(523.25, 'sine', 0.1, 0.06); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.08, 0.06), 80); // E5
  setTimeout(() => playTone(783.99, 'sine', 0.15, 0.06), 160); // G5
};
export const playWarning = () => {
  if (!soundEnabled) return;
  playTone(180, 'sawtooth', 0.15, 0.04, 100);
  setTimeout(() => playTone(180, 'sawtooth', 0.15, 0.04, 100), 200);
};
export const playKeyboard = () => {
  // Mechanical futuristic key sound
  const randomFreq = 400 + Math.random() * 800;
  playTone(randomFreq, 'sine', 0.03, 0.02);
};
