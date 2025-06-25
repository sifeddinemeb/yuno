import React from 'react';

const MissingEnvScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-100 text-center px-6">
      <h1 className="text-3xl font-semibold text-neon-blue mb-4">Configuration Required</h1>
      <p className="text-gray-300 max-w-lg">
        Yuno couldn&rsquo;t find the required Supabase credentials.<br />
        Please create a <code>.env</code> file (or set environment variables) with
        <strong> VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong>.
      </p>
      <div className="mt-6 text-sm text-gray-500">
        See <code>project-docs/DEV-GUIDE.md</code> for instructions.
      </div>
    </div>
  );
};

export default MissingEnvScreen;
