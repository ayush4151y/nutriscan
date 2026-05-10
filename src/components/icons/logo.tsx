
export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }}
          />
        </linearGradient>
        <filter id="dropshadow" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
          <feOffset dx="1" dy="1" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g style={{ filter: 'url(#dropshadow)' }}>
        <path
          d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10zM2 11h2a7 7 0 0 1 7-7V2a10 10 0 0 0-9 9z"
          fill="hsl(var(--primary))"
          stroke="none"
          opacity="0.3"
        />
        <path d="M12 2a10 10 0 0 0-2 19.5A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
        <path
          d="M12 18a6 6 0 0 1-6-6h2a4 4 0 0 0 4 4v2z"
          fill="hsl(var(--primary))"
          stroke="none"
        />
      </g>
    </svg>
  );
}
