'use client';

import { MSWProvider } from './msw-provider';
import { ThemeProvider } from './theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </MSWProvider>
  );
}