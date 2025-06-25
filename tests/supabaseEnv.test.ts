describe('Supabase env guard', () => {
  beforeAll(() => {
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.VITE_SUPABASE_ANON_KEY;
  });

  it('returns false when env vars are missing and stub client works', async () => {
    jest.resetModules();
    const { isSupabaseConfigured, supabase } = require('../src/lib/supabase');

    expect(isSupabaseConfigured).toBe(false);
    const result = await supabase.auth.getSession();
    expect(result.error).toBeDefined();
  });
});
