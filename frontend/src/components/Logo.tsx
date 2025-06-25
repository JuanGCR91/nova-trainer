import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      /* ...el resto de tus props SVG... */
      viewBox="0 0 40 40"
      fill="none"
      // etc.
    >
      {/* ...contenido SVG... */}
    </svg>
  );
}