window.FRESHNET_CONFIG = {
  supabaseUrl: window.FRESHNET_CONFIG?.supabaseUrl || '',
  supabaseAnonKey: window.FRESHNET_CONFIG?.supabaseAnonKey || '',
  mode: 'demo'
};

window.getFreshnetUsers = () => JSON.parse(localStorage.getItem('freshnet_users') || '[]');
window.saveFreshnetUsers = (users) => localStorage.setItem('freshnet_users', JSON.stringify(users));
window.getFreshnetPosts = () => JSON.parse(localStorage.getItem('freshnet_posts') || '[]');
window.saveFreshnetPosts = (posts) => localStorage.setItem('freshnet_posts', JSON.stringify(posts));

window.getCurrentFreshnetUser = () => {
  try {
    return JSON.parse(localStorage.getItem('freshnet_current_user') || 'null');
  } catch {
    return null;
  }
};

window.setCurrentFreshnetUser = (user) => {
  if (!user) localStorage.removeItem('freshnet_current_user');
  else localStorage.setItem('freshnet_current_user', JSON.stringify(user));
};
