document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const joinButton = document.getElementById('joinButton');
  const startButton = document.getElementById('startButton');
  const goAuth = () => {
    window.location.href = 'connexion.html';
  };

  if (joinButton) joinButton.addEventListener('click', goAuth);
  if (startButton) startButton.addEventListener('click', goAuth);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
  }
});
