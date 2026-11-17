document.addEventListener('DOMContentLoaded', async () => {
  const loginTab = document.getElementById('tabLogin');
  const signupTab = document.getElementById('tabSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const message = document.getElementById('message');

  const setMessage = (text, type = '') => {
    if (!message) return;
    message.textContent = text;
    message.className = `message ${type}`.trim();
  };

  const selectTab = (showSignup) => {
    if (loginForm) loginForm.hidden = showSignup;
    if (signupForm) signupForm.hidden = !showSignup;
    loginTab?.classList.toggle('active', !showSignup);
    signupTab?.classList.toggle('active', showSignup);
    loginTab?.setAttribute('aria-selected', String(!showSignup));
    signupTab?.setAttribute('aria-selected', String(showSignup));
    setMessage('');
  };

  loginTab?.addEventListener('click', () => selectTab(false));
  signupTab?.addEventListener('click', () => selectTab(true));

  if (!window.Freshnet?.isSupabaseReady()) {
    setMessage('Supabase ne se charge pas. Vérifie ta connexion et js/config.js.', 'error');
    return;
  }

  try {
    if (await window.Freshnet.getCurrentUser()) {
      window.location.replace('fil.html');
      return;
    }
  } catch (error) {
    setMessage(error.message || 'Impossible de vérifier la session.', 'error');
  }

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = loginForm.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    setMessage('Connexion en cours…');
    try {
      await window.Freshnet.signIn({
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
      });
      window.location.replace('fil.html');
    } catch (error) {
      setMessage(error.message || 'La connexion a échoué.', 'error');
      if (button) button.disabled = false;
    }
  });

  signupForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = signupForm.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    setMessage('Création du compte…');
    try {
      const result = await window.Freshnet.signUp({
        username: document.getElementById('signupUsername').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value
      });
      if (result.session) {
        window.location.replace('fil.html');
        return;
      }
      selectTab(false);
      setMessage('Compte créé. Confirme ton adresse email, puis connecte-toi.', 'success');
    } catch (error) {
      setMessage(error.message || 'La création du compte a échoué.', 'error');
    } finally {
      if (button) button.disabled = false;
    }
  });
});
