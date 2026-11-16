(function () {
  const app = window.Freshnet || {};

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
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
      }
    }
  };

  const readConfigValue = (value) => (typeof value === 'string' ? value.trim() : '');
  const supabaseUrl = readConfigValue(window.FreshnetConfig?.supabaseUrl || window.SUPABASE_URL || '');
  const supabaseKey = readConfigValue(window.FreshnetConfig?.supabaseKey || window.SUPABASE_ANON_KEY || '');

  const client =
    typeof window !== 'undefined' &&
    window.supabase &&
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('YOUR-') &&
    !supabaseKey.includes('YOUR-')
      ? window.supabase.createClient(supabaseUrl, supabaseKey)
      : null;

  app.getSupabaseClient = () => client;
  app.isSupabaseReady = () => Boolean(client);

  app.getUsers = () => storage.get('freshnet-users', []);
  app.saveUsers = (users) => storage.set('freshnet-users', users);

  app.getCurrentUser = async () => {
    if (client) {
      const { data: { user }, error } = await client.auth.getUser();
      if (!error && user) {
        return {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email.split('@')[0]
        };
      }
      return null;
    }

    return storage.get('freshnet-demo-user', null);
  };

  app.setCurrentUser = (user) => {
    if (user) {
      storage.set('freshnet-demo-user', user);
    } else {
      storage.remove('freshnet-demo-user');
    }
  };

  app.signUp = async ({ email, password, username }) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();
    const cleanUsername = String(username || '').trim().slice(0, 24);

    if (!cleanEmail || !cleanPassword || cleanPassword.length < 6 || !cleanUsername) {
      throw new Error('Email, nom d’utilisateur et mot de passe sont requis.');
    }

    if (client) {
      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: { data: { username: cleanUsername } }
      });

      if (error) throw error;
      return data?.user ?? null;
    }

    const users = app.getUsers();
    if (users.some((user) => user.email.toLowerCase() === cleanEmail)) {
      throw new Error('Cette adresse e-mail est déjà utilisée.');
    }

    const user = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword
    };

    users.push(user);
    app.saveUsers(users);
    app.setCurrentUser({ id: user.id, username: user.username, email: user.email });
    return user;
  };

  app.signIn = async ({ email, password }) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Email et mot de passe requis.');
    }

    if (client) {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) throw error;
      return data?.user ?? null;
    }

    const users = app.getUsers();
    const user = users.find((entry) => entry.email.toLowerCase() === cleanEmail && entry.password === cleanPassword);
    if (!user) {
      throw new Error('Identifiants incorrects.');
    }

    app.setCurrentUser({ id: user.id, username: user.username, email: user.email });
    return user;
  };

  app.signOut = async () => {
    if (client) {
      await client.auth.signOut();
    }
    app.setCurrentUser(null);
  };

  app.getPosts = async () => {
    if (client) {
      const { data, error } = await client
        .from('posts')
        .select('id, content, created_at, profiles(username)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((post) => ({
          id: post.id,
          author: post.profiles?.username || 'Utilisateur',
          content: post.content,
          time: new Date(post.created_at).toLocaleString('fr-FR', {
            dateStyle: 'short',
            timeStyle: 'short'
          })
        }));
      }
    }

    return storage.get('freshnet-demo-posts', [
      {
        id: 'welcome-post',
        author: 'Freshnet',
        content: 'Bienvenue sur Freshnet ! Partage tes idées et rejoins la communauté.',
        time: 'À l\'instant'
      }
    ]);
  };

  app.createPost = async (content) => {
    const cleanContent = String(content || '').replace(/[<>]/g, '').trim().slice(0, 500);

    if (!cleanContent) {
      throw new Error('Votre message est vide.');
    }

    if (client) {
      const { data: { user } } = await client.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour publier.');
      }

      const { error } = await client.from('posts').insert({
        content: cleanContent,
        user_id: user.id
      });

      if (error) throw error;
      return true;
    }

    const posts = storage.get('freshnet-demo-posts', []);
    posts.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      author: 'Moi',
      content: cleanContent,
      time: 'À l\'instant'
    });
    storage.set('freshnet-demo-posts', posts);
    return true;
  };

  window.Freshnet = app;
})();
