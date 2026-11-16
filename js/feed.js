document.addEventListener('DOMContentLoaded', () => {
  const user = window.getCurrentFreshnetUser();
  const whoami = document.getElementById('whoami');
  const logoutButton = document.getElementById('logoutButton');
  const postForm = document.getElementById('postForm');
  const postContent = document.getElementById('postContent');
  const feedMessage = document.getElementById('feedMessage');
  const postsContainer = document.getElementById('posts');
  const counter = document.getElementById('counter');

  if (!user) {
    window.location.href = 'connexion.html';
    return;
  }

  if (whoami) whoami.textContent = user.username;

  const renderPosts = () => {
    const posts = window.getFreshnetPosts().sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!postsContainer) return;

    postsContainer.innerHTML = '';
    if (!posts.length) {
      postsContainer.innerHTML = '<div class="post-card"><p>Aucune publication pour le moment. Soyez le premier à écrire quelque chose.</p></div>';
      return;
    }

    posts.forEach((post) => {
      const card = document.createElement('article');
      card.className = 'post-card';
      card.innerHTML = `
        <div class="meta">
          <span class="author">${post.author}</span>
          <span>${new Date(post.date).toLocaleString('fr-FR')}</span>
        </div>
        <p>${post.text}</p>
        <div class="actions">
          <span>♡ J'aime</span>
          <span>Commenter</span>
          <span>Partager</span>
        </div>
      `;
      postsContainer.appendChild(card);
    });
  };

  const setFeedMessage = (text, type = 'success') => {
    if (!feedMessage) return;
    feedMessage.textContent = text;
    feedMessage.className = `message ${type}`;
  };

  const updateCounter = () => {
    if (!counter || !postContent) return;
    counter.textContent = `${postContent.value.length} / 500`;
  };

  postContent?.addEventListener('input', updateCounter);
  updateCounter();

  logoutButton?.addEventListener('click', () => {
    window.setCurrentFreshnetUser(null);
    window.location.href = 'connexion.html';
  });

  postForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = postContent.value.trim();
    if (!text) {
      setFeedMessage('Votre publication ne peut pas être vide.', 'error');
      return;
    }

    const posts = window.getFreshnetPosts();
    posts.push({
      author: user.username,
      text,
      date: new Date().toISOString()
    });
    window.saveFreshnetPosts(posts);
    postContent.value = '';
    updateCounter();
    setFeedMessage('Publication ajoutée avec succès.', 'success');
    renderPosts();
  });

  renderPosts();
});
