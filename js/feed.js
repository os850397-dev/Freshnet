document.addEventListener('DOMContentLoaded', async () => {
  const postsEl = document.getElementById('posts');
  if (!postsEl) return;

  const whoami = document.getElementById('whoami');
  const logoutButton = document.getElementById('logoutButton');
  const form = document.getElementById('postForm');
  const contentInput = document.getElementById('postContent');
  const counter = document.getElementById('counter');
  const message = document.getElementById('feedMessage');
  const publishButton = document.getElementById('publishButton');

  const setMessage = (text, type = '') => {
    if (!message) return;
    message.textContent = text;
    message.className = `message ${type}`.trim();
  };

  const formatDate = (date) => {
    if (!date) return '';
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const renderPosts = (posts) => {
    postsEl.replaceChildren();
    if (!posts.length) {
      const empty = document.createElement('p');
      empty.className = 'message';
      empty.textContent = 'Aucune publication pour le moment. Lance la conversation !';
      postsEl.append(empty);
      return;
    }
    for (const post of posts) {
      const card = document.createElement('article');
      card.className = 'post-card';
      const author = document.createElement('div');
      author.className = 'author';
      author.textContent = post.author || 'Utilisateur';
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = formatDate(post.createdAt);
      const body = document.createElement('p');
      body.className = 'content';
      body.textContent = post.content || '';
      card.append(author, meta, body);
      postsEl.append(card);
    }
  };

  if (!window.Freshnet?.isSupabaseReady()) {
    setMessage('La configuration Supabase est indisponible. Vérifie js/config.js et recharge la page.', 'error');
    if (form) form.hidden = true;
    return;
  }

  try {
    const user = await window.Freshnet.getCurrentUser();
    if (!user) {
      window.location.replace('connexion.html');
      return;
    }
    if (whoami) whoami.textContent = `Bonjour, ${user.username}`;
  } catch {
    window.location.replace('connexion.html');
    return;
  }

  const refresh = async () => {
    setMessage('Chargement du fil…');
    try {
      renderPosts(await window.Freshnet.getPosts());
      setMessage('');
    } catch (error) {
      setMessage(error.message || 'Impossible de charger le fil. Vérifie les tables et les règles RLS Supabase.', 'error');
    }
  };

  contentInput?.addEventListener('input', () => {
    if (counter) counter.textContent = `${contentInput.value.length} / 500`;
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const content = contentInput?.value.trim() || '';
    if (!content) {
      setMessage('Écris un message avant de publier.', 'error');
      return;
    }
    if (publishButton) publishButton.disabled = true;
    setMessage('Publication en cours…');
    try {
      await window.Freshnet.createPost(content);
      form.reset();
      if (counter) counter.textContent = '0 / 500';
      await refresh();
      setMessage('Publication envoyée.', 'success');
    } catch (error) {
      setMessage(error.message || 'Impossible de publier.', 'error');
    } finally {
      if (publishButton) publishButton.disabled = false;
    }
  });

  logoutButton?.addEventListener('click', async () => {
    logoutButton.disabled = true;
    try {
      await window.Freshnet.signOut();
      window.location.replace('connexion.html');
    } catch (error) {
      setMessage(error.message || 'La déconnexion a échoué.', 'error');
      logoutButton.disabled = false;
    }
  });

  await refresh();
});
