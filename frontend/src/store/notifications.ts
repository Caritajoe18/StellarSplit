import { create } from "zustand";
import type { Notification, NotificationType } from "../types/notifications";

interface NotificationsState {
  notifications: Notification[];
  typeFilter: NotificationType | "all";
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  setTypeFilter: (type: NotificationType | "all") => void;
  clearAll: () => void;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  removeNotification: (id: string) => void;
  unreadCount: () => number;
  /** Reset to initial demo state (for tests) */
  resetForTesting: () => void;
}

function createNotification(
  input: Omit<Notification, "id" | "read" | "createdAt">
): Notification {
  return {
    ...input,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString(),
  };
}

const DEMO_NOTIFICATIONS: Notification[] = [
  createNotification({
    type: "split_invitation",
    title: "Split invitation",
    message: "Alex invited you to split \"Weekend dinner\".",
    actionUrl: "/split/1",
  }),
  createNotification({
    type: "payment_reminder",
    title: "Payment reminder",
    message: "You have a pending payment of $25.00 for \"Team lunch\".",
    actionUrl: "/split/2",
  }),
  createNotification({
    type: "payment_received",
    title: "Payment received",
    message: "Jordan paid $15.00 for \"Coffee run\".",
  }),
  createNotification({
    type: "split_completed",
    title: "Split completed",
    message: "\"Trip to the beach\" has been settled.",
    actionUrl: "/split/3",
  }),
  createNotification({
    type: "friend_request",
    title: "Friend request",
    message: "Sam wants to add you as a friend.",
    actionUrl: "/friends",
  }),
  createNotification({
    type: "system_announcement",
    title: "New feature",
    message: "Multi-currency splits are now available.",
  }),
].map((n, i) => ({
  ...n,
  id: `demo-${i}`,
  read: i % 2 === 0,
  createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
}));

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: DEMO_NOTIFICATIONS,
  typeFilter: "all",

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAsUnread: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: false } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  setTypeFilter: (typeFilter) => set({ typeFilter }),

  clearAll: () => set({ notifications: [] }),

  addNotification: (input) =>
    set((state) => ({
      notifications: [
        createNotification(input),
        ...state.notifications,
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  unreadCount: () =>
    get().notifications.filter((n) => !n.read).length,

  resetForTesting: () =>
    set({
      notifications: DEMO_NOTIFICATIONS.map((n) => ({ ...n })),
      typeFilter: "all",
    }),
}));
