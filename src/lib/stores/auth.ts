import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, UserRole } from '@/lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        
        login: (user) => {
          set({ user, isAuthenticated: true });
        },
        
        logout: () => {
          set({ user: null, isAuthenticated: false });
        },
        
        updateUser: (userData) => {
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null
          }));
        },
        
        hasRole: (role) => {
          const { user } = get();
          return user?.role === role;
        },
        
        hasAnyRole: (roles) => {
          const { user } = get();
          return user ? roles.includes(user.role) : false;
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);