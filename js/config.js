const Freshnet = window.Freshnet || {};

Freshnet.storage = {
  get(key, fallback = []) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

Freshnet.users = () => Freshnet.storage.get('freshnet-users', []);
Freshnet.currentUser = () => Freshnet.storage.get('freshnet-current-user', null);
Freshnet.posts = () => Freshnet.storage.get('freshnet-posts', [
  {
    id: crypto.randomUUID(),
    author: 'Freshnet',
    content: 'Bienvenue sur Freshnet ! Partage tes idées et rejoins la communauté.',
    time: 'À l\'instant'
  }
]);

window.Freshnet = Freshnet;
