'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function AuthGuard({ children, requiredRoles = [] }: AuthGuardProps) {
  const { isAuthenticated, user, hasRole } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role as any))) {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, requiredRoles, hasRole, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role as any))) {
    return null;
  }

  return <>{children}</>;
}