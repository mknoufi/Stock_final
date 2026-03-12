import { expect, type APIRequestContext, type Page } from "@playwright/test";

type Role = "staff" | "supervisor" | "admin";

type LoginResponse = {
  success: boolean;
  data: {
    access_token: string;
    refresh_token?: string;
    user: {
      username: string;
      full_name: string;
      has_pin?: boolean;
      role: Role;
    };
  };
};

const BACKEND_BASE_URL =
  process.env.E2E_BACKEND_URL || "http://localhost:8001";

const credentialsByRole: Record<Role, { username: string; password: string }> = {
  staff: { username: "staff1", password: "staff123" },
  supervisor: { username: "supervisor", password: "super123" },
  admin: { username: "admin", password: "admin123" },
};

function buildClientHeaders(clientId: string): Record<string, string> {
  return {
    "x-device-id": clientId,
  };
}

export async function authenticateAs(
  page: Page,
  request: APIRequestContext,
  role: Role,
): Promise<void> {
  const credentials = credentialsByRole[role];
  const response = await request.post(`${BACKEND_BASE_URL}/api/auth/login`, {
    data: credentials,
    headers: buildClientHeaders(`playwright-${role}`),
  });

  expect(response.ok()).toBeTruthy();

  const payload = (await response.json()) as LoginResponse;
  expect(payload.success).toBeTruthy();
  expect(payload.data.user.role).toBe(role);

  await page.addInitScript((auth) => {
    window.localStorage.clear();
    window.localStorage.setItem("auth_token", auth.accessToken);
    if (auth.refreshToken) {
      window.localStorage.setItem("refresh_token", auth.refreshToken);
    }
    window.localStorage.setItem("auth_user", JSON.stringify(auth.user));
    window.localStorage.setItem(
      "last_logged_user",
      JSON.stringify({
        username: auth.user.username,
        full_name: auth.user.full_name,
        has_pin: auth.user.has_pin,
      }),
    );
  }, {
    accessToken: payload.data.access_token,
    refreshToken: payload.data.refresh_token,
    user: payload.data.user,
  });
}

export async function cleanupUserByUsername(
  request: APIRequestContext,
  username: string,
): Promise<void> {
  const loginResponse = await request.post(`${BACKEND_BASE_URL}/api/auth/login`, {
    data: credentialsByRole.admin,
    headers: buildClientHeaders("playwright-admin-cleanup"),
  });
  expect(loginResponse.ok()).toBeTruthy();
  const loginPayload = (await loginResponse.json()) as LoginResponse;

  const headers = {
    Authorization: `Bearer ${loginPayload.data.access_token}`,
  };

  const listResponse = await request.get(
    `${BACKEND_BASE_URL}/api/users?search=${encodeURIComponent(username)}&page=1&page_size=100`,
    { headers },
  );
  expect(listResponse.ok()).toBeTruthy();

  const listPayload = (await listResponse.json()) as {
    users?: Array<{ id: string; username: string }>;
  };

  const matches = (listPayload.users || []).filter(
    (user) => user.username === username,
  );

  for (const user of matches) {
    const deleteResponse = await request.delete(
      `${BACKEND_BASE_URL}/api/users/${user.id}`,
      { headers },
    );
    expect(deleteResponse.ok()).toBeTruthy();
  }
}
