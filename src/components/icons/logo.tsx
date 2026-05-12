export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <defs>
        <linearGradient id="ns-ring" x1="7" y1="9" x2="55" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.58" stopColor="#ffffff" />
          <stop offset="1" stopColor="#7cff3d" />
        </linearGradient>
        <linearGradient id="ns-leaf" x1="17" y1="47" x2="43" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b7ff68" />
          <stop offset="0.5" stopColor="#66f13f" />
          <stop offset="1" stopColor="hsl(var(--primary))" />
        </linearGradient>
        <filter id="ns-glow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="32" cy="32" r="30" fill="#070b08" />

      <path
        d="M50.7 14.7A26.2 26.2 0 1 0 50 49.9"
        stroke="url(#ns-ring)"
        strokeWidth="7.4"
        strokeLinecap="round"
      />
      <path
        d="M50 49.9A26.2 26.2 0 0 0 56.9 34.4"
        stroke="hsl(var(--primary))"
        strokeWidth="7.4"
        strokeLinecap="round"
        filter="url(#ns-glow)"
      />

      <path
        d="M14.8 43.7C24.5 47 37.6 43.4 45.8 29.7C33.7 27.8 21.5 32.9 14.8 43.7Z"
        fill="url(#ns-leaf)"
        filter="url(#ns-glow)"
      />
      <path
        d="M18.2 42.9C26.1 38.7 32.9 36.7 42.2 36.4"
        stroke="#071008"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.85"
      />

      <g filter="url(#ns-glow)">
        <path
          d="M22 20h6M22 20v6M42 20h-6M42 20v6M22 42h6M22 42v-6M42 42h-6M42 42v-6"
          stroke="hsl(var(--primary))"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M48.5 25.5h6.5M48.5 32h8M48.5 38.5h5.5"
          stroke="#a8ff73"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
