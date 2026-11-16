document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const messageEl = document.getElementById('message');

  const setMessage = (text, isError = false) => {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.classList.toggle('error', isError);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const isLogin = tab.id === 'tabLogin';
      document.getElementById('tabLogin').classList.toggle('active', isLogin);
      document.getElementById('tabSignup').classList.toggle('active', !isLogin);
      loginForm.hidden = !isLogin;
      signupForm.hidden = isLogin;
      setMessage('');
    });
  });

  const users = () => window.Freshnet.storage.get('freshnet-users', []);

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      const allUsers = users();
      const user = allUsers.find((entry) => entry.email === email && entry.password === password);

      if (!user) {
        setMessage('Identifiants incorrects. Vérifie ton email et ton mot de passe.', true);
        return;
      }

      window.Freshnet.storage.set('freshnet-current-user', {
        name: user.name,
        email: user.email
      });
      setMessage('Connexion réussie.');
      window.location.href = './fil.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('signupUsername').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;

      const allUsers = users();
      if (allUsers.some((entry) => entry.email === email)) {
        setMessage('Un compte existe déjà avec cet email.', true);
        return;
      }

      const user = { name, email, password };
      allUsers.push(user);
      window.Freshnet.storage.set('freshnet-users', allUsers);
      window.Freshnet.storage.set('freshnet-current-user', { name, email });
      setMessage('Compte créé avec succès.');
      window.location.href = './fil.html';
    });
  }
});
