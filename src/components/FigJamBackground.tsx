export function FigJamBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="#d0d0d0" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#fafafa" />
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>
    </div>
  );
}
