import React from 'react';

// Decorative background blobs. The component renders two layers:
// 1) (Removed)
// 2) A SCROLL layer with blobs positioned far down the page (150-400vh) so new
//    blobs appear as the user scrolls, giving a sense of depth.
// All blobs rely on heavy CSS blur + mix-blend for a performant glow, no JS.
// Rendered once at the root (inside ThemeProvider) and positioned behind all content.


const scrollBlobs = [
  // Smaller blobs spaced further apart and limited to ~3 viewport heights to avoid long empty scroll
  'top-[60vh] left-[15vw] w-[20rem] h-[20rem] bg-neon-orange/70 opacity-35 animate-blob animate-blob-slow',
  'top-[130vh] right-[12vw] w-[18rem] h-[18rem] bg-neon-purple/70 opacity-30 animate-blob animate-blob-delay-2',
  'top-[200vh] left-[50vw] w-[22rem] h-[22rem] bg-neon-blue/70 opacity-40 animate-blob',
  'top-[270vh] right-[45vw] w-[18rem] h-[18rem] bg-neon-pink/70 opacity-25 animate-blob-delay-4',

];

const BackgroundBlobs: React.FC = () => (
  <>
    {/* Scroll layer only */}
    <div className="absolute inset-0 -z-30 overflow-visible pointer-events-none select-none">
      {scrollBlobs.map((cls, i) => (
        <span key={`scroll-${i}`} className={`absolute rounded-full blur-3xl mix-blend-overlay ${cls}`} />
      ))}
    </div>
  </>
);

export default BackgroundBlobs;
