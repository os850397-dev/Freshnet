(function () {
  const app = window.Freshnet || {};

  const fallbackStorage = {
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
        // ignored in restricted browsers
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignored in restricted browsers
      }
    }
  };

  const readConfigValue = (value) => (typeof value === 'string' ? value.trim() : '');
  const supabaseUrl = readConfigValue(window.FreshnetConfig?.supabaseUrl || window.SUPABASE_URL || '');
  const supabaseKey = readConfigValue(window.FreshnetConfig?.supabaseKey || window.SUPABASE_ANON_KEY || '');

  const supabaseClient = (
    typeof window !== 'undefined' &&
    window.supabase &&
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('YOUR-') &&
    !supabaseKey.includes('YOUR-')
  )
    ? window.supabase.createClient(supabaseUrl, supabaseKey)
    : null;

  const isDemoOnly = !supabaseClient;

  const sanitizeText = (value) => String(value ?? '').replace(/[<>]/g, '').trim();

  app.isSupabaseReady = () => Boolean(supabaseClient);
  app.isDemoMode = () => isDemoOnly;
  app.getSupabaseClient = () => supabaseClient;

  app.getUsers = () => fallbackStorage.get('freshnet-users', []);
  app.saveUsers = (users) => fallbackStorage.set('freshnet-users', users);
  app.getCurrentUser = async () => {
    if (supabaseClient) {
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (!error && user) {
        return { id: user.id, email: user.email, username: user.user_metadata?.username || user.email.split('@')[0] };
      }
      return null;
    }

    return fallbackStorage.get('freshnet-demo-user', null);
  };
  app.setCurrentUser = (user) => {
    if (user) {
      fallbackStorage.set('freshnet-demo-user', user);
    } else {
      fallbackStorage.remove('freshnet-demo-user');
    }
  };

  app.signUp = async ({ email, password, username }) => {
    const sanitizedEmail = sanitizeText(email).toLowerCase();
    const sanitizedPassword = String(password || '').trim();
    const sanitizedUsername = sanitizeText(username).slice(0, 24);

    if (!sanitizedEmail || !sanitizedPassword || sanitizedPassword.length < 6 || !sanitizedUsername) {
      throw new Error('Email, nom d’utilisateur et mot de passe sont requis.');
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signUp({
        email: sanitizedEmail,
        password: sanitizedPassword,
        options: { data: { username: sanitizedUsername } }
      });

      if (error) throw error;
      return data?.user ?? null;
    }

    const users = app.getUsers();
    if (users.some((user) => user.email.toLowerCase() === sanitizedEmail)) {
      throw new Error('Cette adresse e-mail est déjà utilisée.');
    }

    const user = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), username: sanitizedUsername, email: sanitizedEmail, password: sanitizedPassword };
    users.push(user);
    app.saveUsers(users);
    app.setCurrentUser({ id: user.id, email: user.email, username: user.username });
    return user;
  };

  app.signIn = async ({ email, password }) => {
    const sanitizedEmail = sanitizeText(email).toLowerCase();
    const sanitizedPassword = String(password || '').trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      throw new Error('Email et mot de passe requis.');
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword
      });

      if (error) throw error;
      return data?.user ?? null;
    }

    const users = app.getUsers();
    const user = users.find((entry) => entry.email.toLowerCase() === sanitizedEmail && entry.password === sanitizedPassword);
    if (!user) {
      throw new Error('Identifiants incorrects.');
    }

    app.setCurrentUser({ id: user.id, email: user.email, username: user.username });
    return user;
  };

  app.signOut = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    app.setCurrentUser(null);
  };

  app.getPosts = async () => {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('posts').select('id, content, created_at, profiles(username)').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((post) => ({
          id: post.id,
          author: post.profiles?.username || 'Utilisateur',
          content: post.content,
          time: new Date(post.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
        }));
      }
    }

    return fallbackStorage.get('freshnet-demo-posts', [
      {
        id: 'welcome-post',
        author: 'Freshnet',
        content: 'Bienvenue sur Freshnet ! Partage tes idées et rejoins la communauté.',
        time: 'À l\'instant'
      }
    ]);
  };

  app.createPost = async (content) => {
    const cleaned = sanitizeText(content).slice(0, 500);
    if (!cleaned) {
      throw new Error('Votre message est vide.');
    }

    if (supabaseClient) {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour publier.');
      }

      const { error } = await supabaseClient.from('posts').insert({
        content: cleaned,
        user_id: user.id
      });

      if (error) throw error;
      return true;
    }

    const posts = fallbackStorage.get('freshnet-demo-posts', []);
    posts.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      author: 'Moi',
      content: cleaned,
      time: 'À l\'instant'
    });
    fallbackStorage.set('freshnet-demo-posts', posts);
    return true;
  };

  window.Freshnet = app;
})();
