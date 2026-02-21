import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, beforeEach } from "vitest";
import { NotificationBell } from "./NotificationBell";
import { useNotificationsStore } from "../../store/notifications";

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("NotificationBell", () => {
  beforeEach(() => {
    useNotificationsStore.getState().resetForTesting();
  });

  it("renders bell icon", () => {
    wrap(<NotificationBell />);
    const bell = screen.getByTestId("notification-bell");
    expect(bell).toBeInTheDocument();
  });

  it("shows badge count when there are unread notifications", () => {
    wrap(<NotificationBell />);
    const badge = screen.getByTestId("notification-badge");
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toMatch(/\d+/);
  });

  it("opens dropdown when bell is clicked", () => {
    wrap(<NotificationBell />);
    fireEvent.click(screen.getByTestId("notification-bell"));
    expect(screen.getByTestId("notification-dropdown")).toBeInTheDocument();
  });

  it("dropdown shows notification list", () => {
    wrap(<NotificationBell />);
    fireEvent.click(screen.getByTestId("notification-bell"));
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });
});
