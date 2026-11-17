(function () {
  const existing = window.FreshnetConfig || {};
  const url = typeof existing.supabaseUrl === 'string' ? existing.supabaseUrl.trim() : 'https://klkcjtqqodeicqbgxfaa.supabase.co';
  const key = typeof existing.supabaseKey === 'string' ? existing.supabaseKey.trim() : 'sb_publishable_32Njy0xIgW5-gKmIwRG96w_KsJF9BW9';

  window.FreshnetConfig = {
    supabaseUrl: url,
    supabaseKey: key
  };
})();
