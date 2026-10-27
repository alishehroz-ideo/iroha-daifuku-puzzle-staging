// GameBull hosting for iroHa: no pinch / double-tap zoom; iPhone audio session. The game's own sound setting is unchanged.
(() => {
  const stop = e => e.preventDefault();
  document.addEventListener('gesturestart', stop, { passive: false });
  document.addEventListener('touchmove', e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  document.addEventListener('pointerdown', () => { try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {} }, { once: true, capture: true });
})();
