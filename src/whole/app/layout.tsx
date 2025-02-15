import React from 'react';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Using a simple check since window.location isn't available in SSR
  const isPageBuilder =
    typeof document !== 'undefined' &&
    document.location.pathname.includes('page-builder');

  return (
    <html lang="en">
      <body className={isPageBuilder ? 'page-builder-layout' : ''}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
