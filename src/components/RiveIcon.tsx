import type { SVGProps } from "react";

export function RiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 18V6h5.5a4 4 0 1 1 0 8H7" />
      <path d="M12 14l5 4" />
    </svg>
  );
}
