/*
  # Fix admin_users table RLS policy for INSERT operations

  1. Security Policy Changes
    - Add INSERT policy for admin_users table to allow authenticated users to create their own record
    - Ensures users can only insert records where the id matches their auth.uid()

  2. Problem Resolution
    - Fixes "new row violates row-level security policy" error
    - Allows admin user profile creation during authentication flow
    - Maintains security by restricting users to only create their own records
*/

-- Add INSERT policy for admin_users table
CREATE POLICY "Allow authenticated users to create their own admin_user record"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);