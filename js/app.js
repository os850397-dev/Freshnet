document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const joinButton = document.getElementById('joinButton');
  const startButton = document.getElementById('startButton');
  const authAction = () => {
    window.location.href = 'connexion.html';
  };

  if (joinButton) joinButton.addEventListener('click', authAction);
  if (startButton) startButton.addEventListener('click', authAction);
});
