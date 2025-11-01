export function FigJamBackground() {
  return (
    <div className="absolute top-0 left-0 -z-10 w-full pointer-events-none" style={{ height: '4830.63px' }}>
      <svg
        width="100%"
        height="4830.63"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="dotPattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.9" fill="#cccccc" opacity="0.55" />
          </pattern>
        </defs>
        <rect width="100%" height="4830.63" fill="#fafafa" />
        <rect width="100%" height="4830.63" fill="url(#dotPattern)" />
      </svg>
    </div>
  );
}
