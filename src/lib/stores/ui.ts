import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Notification } from '@/lib/types';

interface UIState {
  theme: 'light' | 'dark' | 'high-contrast';
  locale: string;
  currency: string;
  sidebarOpen: boolean;
  notifications: Notification[];
  unreadCount: number;
  
  // Theme
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;
  
  // Locale and Currency
  setLocale: (locale: string) => void;
  setCurrency: (currency: string) => void;
  
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Performance
  animationsEnabled: boolean;
  highPerformanceMode: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  setHighPerformanceMode: (enabled: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'light',
        locale: 'en-IN',
        currency: 'USD',
        sidebarOpen: true,
        notifications: [],
        unreadCount: 0,
        animationsEnabled: true,
        highPerformanceMode: false,
        
        setTheme: (theme) => {
          set({ theme });
          // Apply theme to document
          document.documentElement.setAttribute('data-theme', theme);
        },
        
        setLocale: (locale) => {
          set({ locale });
        },
        
        setCurrency: (currency) => {
          set({ currency });
        },
        
        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }));
        },
        
        setSidebarOpen: (open) => {
          set({ sidebarOpen: open });
        },
        
        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random()}`,
            createdAt: new Date(),
          };
          
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
          }));
        },
        
        markAsRead: (id) => {
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true, readAt: new Date() } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        },
        
        markAllAsRead: () => {
          set((state) => ({
            notifications: state.notifications.map((n) => ({
              ...n,
              isRead: true,
              readAt: new Date(),
            })),
            unreadCount: 0,
          }));
        },
        
        removeNotification: (id) => {
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadCount: notification && !notification.isRead 
                ? Math.max(0, state.unreadCount - 1) 
                : state.unreadCount,
            };
          });
        },
        
        clearNotifications: () => {
          set({ notifications: [], unreadCount: 0 });
        },
        
        setAnimationsEnabled: (enabled) => {
          set({ animationsEnabled: enabled });
        },
        
        setHighPerformanceMode: (enabled) => {
          set({ highPerformanceMode: enabled });
        },
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          locale: state.locale,
          currency: state.currency,
          animationsEnabled: state.animationsEnabled,
          highPerformanceMode: state.highPerformanceMode,
        }),
      }
    ),
    { name: 'ui-store' }
  )
);