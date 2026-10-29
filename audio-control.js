// Keep the game silent until the player explicitly enables its audio.
(() => {
  let muted = false;
  const contexts = new Map();
  for (const name of ['AudioContext', 'webkitAudioContext']) {
    const Original = window[name];
    if (!Original) continue;
    window[name] = class extends Original {
      constructor(...args) {
        super(...args);
        const resume = super.resume.bind(this);
        contexts.set(this, resume);
        this.resume = () => muted ? Promise.resolve() : resume();
        if (muted && this.state === 'running') this.suspend().catch(() => {});
      }
    };
  }
  function update() {
    const button = document.getElementById('game-audio');
    button.textContent = muted ? '音声：オフ' : '音声：オン';
    button.setAttribute('aria-pressed', String(muted));
    button.setAttribute('aria-label', muted ? 'ゲームの音声をオンにする' : 'ゲームの音声をオフにする');
  }
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('game-audio');
    button.onclick = () => {
      muted = !muted;
      window.dispatchEvent(new CustomEvent("iroha-audio-change", {detail: !muted}));
      for (const [context, resume] of contexts) {
        if (context.state === 'closed') continue;
        (muted ? context.suspend() : resume()).catch(() => {});
      }
      update();
    };
    update();
  });
})();

