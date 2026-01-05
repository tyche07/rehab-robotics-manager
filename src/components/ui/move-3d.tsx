import React from 'react';
import { cn } from '@/lib/utils';

export const Move3d = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(className)}
    {...props}
  >
    <path d="M5 3v10.93a7 7 0 0 0 6.002 6.953c.33.04.662.06.998.06A6.995 6.995 0 0 0 19 13V3" />
    <path d="M5 14s2.5 2 5 2 5-2 5-2" />
    <path d="M5 9s2.5 2 5 2 5-2 5-2" />
  </svg>
);
