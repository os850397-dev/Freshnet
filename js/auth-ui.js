(function () {
  const app = window.Freshnet;
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const message = document.getElementById('message');

  if (!loginForm || !signupForm || !tabLogin || !tabSignup || !message) return;

  function showMessage(text, error = false) {
    message.textContent = text;
    message.className = error ? 'message error' : 'message success';
  }

  function switchTab(login) {
    loginForm.hidden = !login;
    signupForm.hidden = login;
    tabLogin.classList.toggle('active', login);
    tabSignup.classList.toggle('active', !login);
    showMessage('');
  }

  if (!app) {
    showMessage('La connexion au service est mal configurée. Vérifie la configuration Supabase.', true);
    return;
  }

  tabLogin.addEventListener('click', () => switchTab(true));
  tabSignup.addEventListener('click', () => switchTab(false));

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = loginForm.querySelector('button[type="submit"]');
    button.disabled = true;
    showMessage('Connexion en cours...');

    try {
      await app.signIn({
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value
      });
      window.location.href = 'fil.html';
    } catch (error) {
      showMessage(error.message || 'Échec de la connexion.', true);
    } finally {
      button.disabled = false;
    }
  });

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = signupForm.querySelector('button[type="submit"]');
    button.disabled = true;
    showMessage('Création du compte...');

    try {
      await app.signUp({
        username: document.getElementById('signupUsername').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        password: document.getElementById('signupPassword').value
      });

      const user = await app.getCurrentUser();
      if (user) {
        window.location.href = 'fil.html';
      } else {
        switchTab(true);
        showMessage('Compte créé. Vérifie ton adresse e-mail pour confirmer ton inscription.');
      }
    } catch (error) {
      showMessage(error.message || 'Échec de la création du compte.', true);
    } finally {
      button.disabled = false;
    }
  });

  switchTab(true);
})();
