(function () {
  const existing = window.FreshnetConfig || {};
  window.FreshnetConfig = {
    // Supabase's publishable/anon key is intended for browser use. Never put a service_role key here.
    supabaseUrl: existing.supabaseUrl || 'https://klkcjtqqodeicqbgxfaa.supabase.co',
    supabaseKey: existing.supabaseKey || 'sb_publishable_32Njy0xIgW5-gKmIwRG96w_KsJF9BW9'
  };
})();
