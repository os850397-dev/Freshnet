document.addEventListener('DOMContentLoaded', async () => {
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const messageEl = document.getElementById('message');

  const setMessage = (text, type = 'success') => {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
  };

  const showLogin = () => {
    tabLogin?.classList.add('active');
    tabSignup?.classList.remove('active');
    if (loginForm) loginForm.hidden = false;
    if (signupForm) signupForm.hidden = true;
    setMessage('');
  };

  const showSignup = () => {
    tabSignup?.classList.add('active');
    tabLogin?.classList.remove('active');
    if (signupForm) signupForm.hidden = false;
    if (loginForm) loginForm.hidden = true;
    setMessage('');
  };

  tabLogin?.addEventListener('click', showLogin);
  tabSignup?.addEventListener('click', showSignup);

  const currentUser = await window.Freshnet.getCurrentUser();
  if (currentUser && window.location.pathname.endsWith('connexion.html')) {
    window.location.href = 'fil.html';
    return;
  }

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const user = await window.Freshnet.signIn({ email, password });
      if (!user) {
        throw new Error('Connexion impossible.');
      }

      setMessage('Connexion réussie ! Redirection...', 'success');
      setTimeout(() => {
        window.location.href = 'fil.html';
      }, 250);
    } catch (error) {
      setMessage(error.message || 'Une erreur est survenue pendant la connexion.', 'error');
    }
  });

  signupForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    try {
      const user = await window.Freshnet.signUp({ username, email, password });
      if (!user) {
        throw new Error('Impossible de créer le compte.');
      }

      setMessage('Compte créé avec succès ! Redirection...', 'success');
      setTimeout(() => {
        window.location.href = 'fil.html';
      }, 250);
    } catch (error) {
      setMessage(error.message || 'Une erreur est survenue pendant la création du compte.', 'error');
    }
  });

  if (!window.Freshnet.isSupabaseReady()) {
    setMessage('Mode démo actif : configure Supabase pour passer en production.', 'success');
  }
});
