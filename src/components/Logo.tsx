import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  light = false,
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 42, text: 'text-lg', sub: 'text-[11px]' },
    lg: { icon: 64, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 96, text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // SVG emblem for the Mastin Immobilier logo
  const EmblemSvg = (
    <svg
      viewBox="0 0 200 200"
      className="shrink-0"
      style={{ width: currentSize.icon, height: currentSize.icon }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle if badge mode or standalone */}
      {variant === 'badge' ? (
        <circle cx="100" cy="100" r="98" fill="#FFFFFF" stroke="#F1F5F9" strokeWidth="2" />
      ) : null}

      <g transform={variant === 'badge' ? 'translate(30, 20) scale(0.7)' : 'translate(0, 0)'}>
        {/* Outer Square Frame in Red */}
        <rect
          x="20"
          y="20"
          width="160"
          height="160"
          stroke="#E11D48"
          strokeWidth="11"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* Central Architectural Skyline */}
        {/* Center Tower with gable roof */}
        <path
          d="M 100 48 L 132 68 V 160 H 68 V 68 Z"
          stroke="#E11D48"
          strokeWidth="11"
          strokeLinejoin="miter"
          strokeLinecap="square"
          fill="none"
        />

        {/* Left Building with pitched roof */}
        <path
          d="M 42 108 L 68 88 V 160 H 42 Z"
          stroke="#E11D48"
          strokeWidth="11"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* Right Building with pitched roof */}
        <path
          d="M 132 94 L 158 114 V 160 H 132"
          stroke="#E11D48"
          strokeWidth="11"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* Inner geometric opening / door structure */}
        <path
          d="M 88 160 V 98 H 112 V 132 H 100 V 160"
          stroke="#E11D48"
          strokeWidth="9"
          strokeLinejoin="miter"
          fill="none"
        />
      </g>

      {/* If badge mode, also render the typography inside the circular badge like the user's photo */}
      {variant === 'badge' && (
        <>
          <text
            x="100"
            y="152"
            textAnchor="middle"
            fill="#0F172A"
            fontWeight="800"
            fontSize="22"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="2px"
          >
            MASTIN
          </text>
          <text
            x="100"
            y="172"
            textAnchor="middle"
            fill="#E11D48"
            fontWeight="700"
            fontSize="12.5"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="3.5px"
          >
            IMMOBILIER
          </text>
        </>
      )}
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center justify-center drop-shadow-sm ${className}`}>
        {EmblemSvg}
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {EmblemSvg}
      </div>
    );
  }

  // Full lockup: Emblem + Typography side-by-side
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem with subtle white/red framing */}
      <div className="relative p-1 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
        {EmblemSvg}
      </div>

      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-black tracking-wider uppercase ${currentSize.text} ${
            light ? 'text-white' : 'text-slate-900'
          }`}
          style={{ letterSpacing: '0.08em' }}
        >
          MASTIN
        </span>
        <span
          className={`font-bold tracking-widest uppercase mt-0.5 text-rose-600 ${currentSize.sub}`}
          style={{ letterSpacing: '0.22em' }}
        >
          IMMOBILIER
        </span>
      </div>
    </div>
  );
};
