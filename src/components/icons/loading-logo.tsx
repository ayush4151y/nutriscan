import { cn } from "@/lib/utils";

export function LoadingLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <>
      <style>
        {`
          @keyframes spin-and-pause {
            0% {
              transform: rotate(0deg);
            }
            80% {
              transform: rotate(360deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          .spinner-inner {
            animation: spin-and-pause 1.5s ease-in-out infinite;
            transform-origin: center;
          }
        `}
      </style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(className)}
        {...props}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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
        <g className="static-outer" style={{ filter: 'url(#dropshadow)' }}>
            <path
            d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10zM2 11h2a7 7 0 0 1 7-7V2a10 10 0 0 0-9 9z"
            stroke="none"
            className="fill-foreground/30 dark:fill-primary-foreground/30"
            />
            <path 
              d="M12 2a10 10 0 0 0-2 19.5A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
              className="stroke-foreground dark:stroke-primary-foreground"
             />
        </g>
        <g className="spinner-inner" style={{ filter: 'url(#glow)' }}>
            <path
            d="M12 18a6 6 0 0 1-6-6h2a4 4 0 0 0 4 4v2z"
            fill="hsl(var(--primary))"
            stroke="none"
            />
        </g>
      </svg>
    </>
  );
}
