(function () {
  const config = window.FreshnetConfig || {};
  const url = typeof config.supabaseUrl === 'string' ? config.supabaseUrl.trim() : '';
  const key = typeof config.supabaseKey === 'string' ? config.supabaseKey.trim() : '';
  const isConfigured = url.startsWith('https://') && key.length > 20 && !url.includes('YOUR-') && !key.includes('YOUR-');
  const client = isConfigured && window.supabase?.createClient
    ? window.supabase.createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      })
    : null;

  const requireClient = () => {
    if (!client) {
      throw new Error('Supabase n’est pas configuré. Vérifie js/config.js et le schéma SQL.');
    }
    return client;
  };

  const normalizeUser = (user) => user ? ({
    id: user.id,
    email: user.email || '',
    username: user.user_metadata?.username || (user.email ? user.email.split('@')[0] : 'Utilisateur')
  }) : null;

  window.Freshnet = {
    getSupabaseClient: () => client,
    isSupabaseReady: () => Boolean(client),
    async getCurrentUser() {
      if (!client) return null;
      const { data, error } = await client.auth.getUser();
      if (error) return null;
      return normalizeUser(data.user);
    },
    async signUp({ email, password, username }) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      const cleanUsername = String(username || '').trim();
      const cleanPassword = String(password || '');
      if (!cleanEmail || cleanUsername.length < 3 || cleanUsername.length > 24 || cleanPassword.length < 6) {
        throw new Error('Vérifie ton email, ton nom (3 à 24 caractères) et ton mot de passe (6 caractères minimum).');
      }
      const { data, error } = await requireClient().auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: { data: { username: cleanUsername } }
      });
      if (error) throw error;
      return { user: normalizeUser(data.user), session: data.session };
    },
    async signIn({ email, password }) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!cleanEmail || !password) throw new Error('Email et mot de passe requis.');
      const { data, error } = await requireClient().auth.signInWithPassword({ email: cleanEmail, password: String(password) });
      if (error) throw error;
      return normalizeUser(data.user);
    },
    async signOut() {
      if (!client) return;
      const { error } = await client.auth.signOut();
      if (error) throw error;
    },
    async getPosts() {
      const { data, error } = await requireClient()
        .from('posts')
        .select('id, content, created_at, profiles!posts_user_id_fkey(username)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data || []).map((post) => ({
        id: post.id,
        author: post.profiles?.username || 'Utilisateur',
        content: post.content,
        createdAt: post.created_at
      }));
    },
    async createPost(content) {
      const cleanContent = String(content || '').trim();
      if (!cleanContent || cleanContent.length > 500) throw new Error('Le message doit contenir entre 1 et 500 caractères.');
      const supabase = requireClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Tu dois être connecté pour publier.');
      const { error } = await supabase.from('posts').insert({ user_id: user.id, content: cleanContent });
      if (error) throw error;
    }
  };
})();
