/* Initialise le client Supabase et expose les fonctions utilisées par l'interface. */
(function () {
  const config = window.FreshnetConfig;
  const supabaseLibrary = window.supabase;

  if (!config || !config.supabaseUrl || !config.supabaseKey || !supabaseLibrary || typeof supabaseLibrary.createClient !== 'function') {
    window.Freshnet = null;
    return;
  }

  const client = supabaseLibrary.createClient(config.supabaseUrl, config.supabaseKey);

  window.Freshnet = {
    client,
    isSupabaseReady: () => true,

    async signIn({ email, password }) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    },

    async signUp({ username, email, password }) {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error) throw error;
      return data.user;
    },

    async getCurrentUser() {
      const { data, error } = await client.auth.getUser();
      if (error && error.name !== 'AuthSessionMissingError') throw error;
      return data?.user ?? null;
    },

    async signOut() {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    }
  };
})();
