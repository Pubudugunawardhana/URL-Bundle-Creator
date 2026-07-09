'use client';

import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

export default function FaviconImage({ src }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <LinkIcon size={16} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt="" 
      style={{ width: 32, height: 32, borderRadius: 6, flexShrink: 0 }} 
      onError={() => setError(true)} 
    />
  );
}
