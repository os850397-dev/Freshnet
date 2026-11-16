document.addEventListener('DOMContentLoaded', () => {
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

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const users = window.Freshnet.getUsers();
    const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password);

    if (!user) {
      setMessage('Identifiants incorrects.', 'error');
      return;
    }

    window.Freshnet.setCurrentUser({
      username: user.username,
      email: user.email
    });

    setMessage('Connexion réussie ! Redirection...', 'success');
    setTimeout(() => {
      window.location.href = 'fil.html';
    }, 300);
  });

  signupForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!username || !email || password.length < 6) {
      setMessage('Complétez tous les champs correctement.', 'error');
      return;
    }

    const users = window.Freshnet.getUsers();
    const exists = users.some((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setMessage('Cette adresse e-mail est déjà utilisée.', 'error');
      return;
    }

    users.push({ username, email, password });
    window.Freshnet.saveUsers(users);
    window.Freshnet.setCurrentUser({ username, email });
    setMessage('Compte créé avec succès ! Vous êtes connecté.', 'success');
    setTimeout(() => {
      window.location.href = 'fil.html';
    }, 300);
  });

  const currentUser = window.Freshnet.getCurrentUser();
  if (currentUser) {
    setMessage(`Bon retour, ${currentUser.username || currentUser.email}!`, 'success');
  }
});
