import { describe, expect, it } from "@jest/globals";

import { normalizeUserListPayload, reconcileSelectedUserIds } from "../adminUsersData";

describe("adminUsersData", () => {
  it("normalizes direct paginated users response", () => {
    const result = normalizeUserListPayload({
      users: [
        {
          id: "u1",
          username: "alice",
          full_name: "Alice Doe",
          role: "admin",
          email: "alice@example.com",
          is_active: true,
          permissions: ["users.read"],
          created_at: "2026-01-01T00:00:00Z",
          last_login: null,
        },
      ],
      total: 1,
      total_pages: 1,
    });

    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.users).toEqual([
      {
        id: "u1",
        username: "alice",
        fullName: "Alice Doe",
        role: "admin",
        email: "alice@example.com",
        isActive: true,
        permissions: ["users.read"],
        hasPin: undefined,
        createdAt: "2026-01-01T00:00:00Z",
        lastLogin: null,
        permissionsCount: 1,
      },
    ]);
  });

  it("normalizes wrapped payload and falls back safely", () => {
    const result = normalizeUserListPayload({
      success: true,
      data: {
        users: [
          {
            id: "u2",
            username: "bob",
            full_name: "",
            role: "staff",
            is_active: false,
            permissions: [],
            permissions_count: 0,
          },
          { username: "missing-id" },
        ],
        total: "2",
        total_pages: "3",
      },
    });

    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(result.users).toEqual([
      {
        id: "u2",
        username: "bob",
        fullName: null,
        role: "staff",
        email: null,
        isActive: false,
        permissions: [],
        hasPin: undefined,
        createdAt: null,
        lastLogin: null,
        permissionsCount: 0,
      },
    ]);
  });

  it("returns stable empty state for malformed payload", () => {
    expect(normalizeUserListPayload(undefined)).toEqual({
      users: [],
      total: 0,
      totalPages: 1,
    });
  });

  it("reconciles selected ids to only visible users", () => {
    const visibleUsers = normalizeUserListPayload({
      users: [
        { id: "u1", username: "alice" },
        { id: "u2", username: "bob" },
      ],
    }).users;

    const reconciled = reconcileSelectedUserIds(new Set(["u1", "u3"]), visibleUsers);
    expect(Array.from(reconciled)).toEqual(["u1"]);
  });
});
