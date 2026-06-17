'use client';

import { useEffect, useState } from 'react';

interface StreamingTextProps {
  text: string;
}

export function StreamingText({ text }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(text);
  }, [text]);

  return (
    <p
      aria-live="assertive"
      aria-atomic="true"
      className="relative whitespace-pre-line"
    >
      {displayedText}
      <span className="inline-block w-1.5 h-4.5 bg-emerald-450 bg-emerald-400 animate-blink ml-1 align-middle" aria-hidden="true"></span>
    </p>
  );
}
