import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, beforeEach } from "vitest";
import { NotificationCenter } from "./NotificationCenter";
import { useNotificationsStore } from "../../store/notifications";

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("NotificationCenter", () => {
  beforeEach(() => {
    useNotificationsStore.getState().resetForTesting();
  });

  it("renders notification center page", () => {
    wrap(<NotificationCenter />);
    expect(screen.getByTestId("notification-center")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /notifications/i })).toBeInTheDocument();
  });

  it("shows filter by type options", () => {
    wrap(<NotificationCenter />);
    expect(screen.getByText("Filter by type")).toBeInTheDocument();
    expect(screen.getByTestId("filter-all")).toBeInTheDocument();
    expect(screen.getByTestId("filter-split_invitation")).toBeInTheDocument();
  });

  it("filter updates displayed list", () => {
    wrap(<NotificationCenter />);
    fireEvent.click(screen.getByTestId("filter-payment_received"));
    expect(screen.getByTestId("filter-payment_received")).toHaveClass("bg-accent");
  });

  it("mark all as read button is present when there are unread", () => {
    wrap(<NotificationCenter />);
    expect(screen.getByTestId("mark-all-read")).toBeInTheDocument();
  });

  it("mark all as read clears unread", () => {
    wrap(<NotificationCenter />);
    fireEvent.click(screen.getByTestId("mark-all-read"));
    expect(screen.queryByTestId("mark-all-read")).not.toBeInTheDocument();
  });

  it("clear all removes all notifications", () => {
    wrap(<NotificationCenter />);
    fireEvent.click(screen.getByTestId("clear-all"));
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("No notifications yet.")).toBeInTheDocument();
  });

  it("simulate new notification adds an item", () => {
    useNotificationsStore.getState().clearAll();
    wrap(<NotificationCenter />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("simulate-notification"));
    expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
  });
});
