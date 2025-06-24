/*
  # Disable Email Confirmation for Development

  This migration disables email confirmation to streamline the development process.
  In production, you may want to re-enable this for security.
*/

-- This is handled in Supabase dashboard settings, but we'll document it here
-- Go to Authentication > Settings in Supabase dashboard
-- Turn OFF "Enable email confirmations"
-- This allows immediate login after signup without email verification