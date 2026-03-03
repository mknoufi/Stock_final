import { describe, expect, it } from "@jest/globals";

import {
  applyUserPermissionChange,
  normalizePermissionCatalogPayload,
  normalizeUserPermissionsPayload,
} from "../adminPermissionsData";

describe("adminPermissionsData", () => {
  it("normalizes wrapped permission catalog payload", () => {
    const normalized = normalizePermissionCatalogPayload({
      success: true,
      data: {
        permissions: ["user.manage", "session.start"],
        categories: {
          admin: ["user.manage"],
          session: ["session.start"],
        },
      },
    });

    expect(normalized.permissions).toEqual(["user.manage", "session.start"]);
    expect(normalized.categories.admin).toEqual(["user.manage"]);
    expect(normalized.categories.session).toEqual(["session.start"]);
  });

  it("normalizes direct catalog payload and drops malformed category entries", () => {
    const normalized = normalizePermissionCatalogPayload({
      permissions: ["export.own"],
      categories: {
        export: ["export.own", 123],
        invalid: "x",
      },
    });

    expect(normalized.permissions).toEqual(["export.own"]);
    expect(normalized.categories.export).toEqual(["export.own"]);
    expect(normalized.categories.invalid).toBeUndefined();
  });

  it("normalizes user permissions from wrapped payload", () => {
    const permissions = normalizeUserPermissionsPayload({
      success: true,
      data: {
        permissions: ["report.view", "export.own"],
      },
    });

    expect(permissions).toEqual(["report.view", "export.own"]);
  });

  it("supports direct user permissions arrays", () => {
    const permissions = normalizeUserPermissionsPayload(["a", "b", 12]);
    expect(permissions).toEqual(["a", "b"]);
  });

  it("applies add/remove updates without duplicates", () => {
    expect(applyUserPermissionChange(["a"], "a", "add")).toEqual(["a"]);
    expect(applyUserPermissionChange(["a"], "b", "add")).toEqual(["a", "b"]);
    expect(applyUserPermissionChange(["a", "b"], "a", "remove")).toEqual(["b"]);
  });
});
