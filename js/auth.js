(function () {
  const Freshnet = window.Freshnet || {};

  const storage = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value !== null ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // ignore storage errors in restricted browsers
      }
    }
  };

  Freshnet.storage = storage;
  Freshnet.getUsers = () => Freshnet.storage.get('freshnet-users', []);
  Freshnet.saveUsers = (users) => Freshnet.storage.set('freshnet-users', users);
  Freshnet.getCurrentUser = () => Freshnet.storage.get('freshnet-current-user', null);
  Freshnet.setCurrentUser = (user) => Freshnet.storage.set('freshnet-current-user', user);
  Freshnet.getPosts = () => Freshnet.storage.get('freshnet-posts', [
    {
      id: crypto.randomUUID ? crypto.randomUUID() : 'welcome-post',
      author: 'Freshnet',
      content: 'Bienvenue sur Freshnet ! Partage tes idées et rejoins la communauté.',
      time: 'À l\'instant'
    }
  ]);
  Freshnet.savePosts = (posts) => Freshnet.storage.set('freshnet-posts', posts);

  window.Freshnet = Freshnet;
})();
