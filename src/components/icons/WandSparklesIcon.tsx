import { SVGProps } from 'react';

export function WandSparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 3 2.5 2.5" />
      <path d="m13.5 4.5 2.5 2.5" />
      <path d="M19 13h2" />
      <path d="m21 5-2.5 2.5" />
      <path d="m5 21 2.5-2.5" />
      <path d="M11 4.5 7 8.5" />
      <path d="M11 21v-3.5L18.5 10 21 7.5 16.5 3 14 5.5l-7.5 7.5V21h3.5Z" />
    </svg>
  );
}
