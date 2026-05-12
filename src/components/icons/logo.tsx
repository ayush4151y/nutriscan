export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <defs>
        <linearGradient id="nutriscan-ring" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.52" stopColor="#f8fff9" />
          <stop offset="1" stopColor="hsl(var(--primary))" />
        </linearGradient>
        <linearGradient id="nutriscan-leaf" x1="18" y1="42" x2="42" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7cff3d" />
          <stop offset="1" stopColor="hsl(var(--primary))" />
        </linearGradient>
        <filter id="nutriscan-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="32" cy="32" r="29" fill="hsl(var(--background))" />

      <path
        d="M52.5 16.5A27 27 0 1 0 51.1 49"
        stroke="url(#nutriscan-ring)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M51.1 49A27 27 0 0 0 57.3 35"
        stroke="hsl(var(--primary))"
        strokeWidth="7"
        strokeLinecap="round"
        filter="url(#nutriscan-glow)"
      />

      <path
        d="M16.8 43.6c10.4 1.3 20.6-3.8 25.3-13.5-8.7-.2-18.2 3.8-25.3 13.5Z"
        fill="url(#nutriscan-leaf)"
      />
      <path
        d="M18 43.2c6.1-3.2 12.2-5.5 20.1-6.1"
        stroke="hsl(var(--background))"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.9"
      />

      <path
        d="M21 21h7M21 21v7M43 21h-7M43 21v7M21 43h7M21 43v-7M43 43h-7M43 43v-7"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#nutriscan-glow)"
      />

      <path
        d="M49 25h7M49 32h9M49 39h6"
        stroke="hsl(var(--primary))"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}
