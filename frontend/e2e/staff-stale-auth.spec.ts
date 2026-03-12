import { test, expect } from "@playwright/test";

const BACKEND_BASE_URL =
  process.env.E2E_BACKEND_URL || "http://127.0.0.1:8001";

const INVALID_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiJzdGFmZjEiLCJyb2xlIjoic3RhZmYiLCJleHAiOjQxMDI0NDQ4MDB9." +
  "invalid-signature";

type LoginResponse = {
  success: boolean;
  data: {
    access_token: string;
    user: {
      username: string;
      full_name: string;
      has_pin?: boolean;
      role: "staff" | "supervisor" | "admin";
    };
  };
};

test.describe("Staff Scan Stale Auth", () => {
  test("scan screen does not loop stats refresh or websocket reconnect after auth failure", async ({
    page,
    request,
  }) => {
    const loginResponse = await request.post(`${BACKEND_BASE_URL}/api/auth/login`, {
      data: {
        username: "staff1",
        password: "staff123",
      },
      headers: {
        "x-device-id": "playwright-stale-auth",
      },
    });

    expect(loginResponse.ok()).toBeTruthy();

    const loginPayload = (await loginResponse.json()) as LoginResponse;
    const createSessionResponse = await request.post(
      `${BACKEND_BASE_URL}/api/sessions/`,
      {
        data: {
          warehouse: "Showroom",
          type: "STANDARD",
        },
        headers: {
          Authorization: `Bearer ${loginPayload.data.access_token}`,
          "x-device-id": "playwright-stale-auth",
        },
      },
    );

    expect(createSessionResponse.ok()).toBeTruthy();

    const sessionPayload = (await createSessionResponse.json()) as {
      id: string;
    };

    const sessionId = sessionPayload.id;
    const statsResponses: string[] = [];
    const refreshResponses: string[] = [];
    const websocketAttempts: string[] = [];

    page.on("response", (response) => {
      const url = response.url();
      if (url.includes(`/api/sessions/${sessionId}/stats`)) {
        statsResponses.push(`${response.status()} ${url}`);
      }
      if (url.includes("/api/auth/refresh")) {
        refreshResponses.push(`${response.status()} ${url}`);
      }
    });

    page.on("websocket", (websocket) => {
      if (websocket.url().includes("/ws/updates")) {
        websocketAttempts.push(websocket.url());
      }
    });

    await page.addInitScript(
      ({ invalidToken, user }) => {
        window.localStorage.clear();
        window.localStorage.setItem("auth_token", invalidToken);
        window.localStorage.setItem("auth_user", JSON.stringify(user));
        window.localStorage.setItem(
          "last_logged_user",
          JSON.stringify({
            username: user.username,
            full_name: user.full_name,
            has_pin: user.has_pin,
          }),
        );
        window.localStorage.removeItem("refresh_token");
      },
      {
        invalidToken: INVALID_ACCESS_TOKEN,
        user: loginPayload.data.user,
      },
    );

    await page.goto(`/staff/scan?sessionId=${encodeURIComponent(sessionId)}`);

    await page.waitForURL(/\/welcome(?:\?.*)?$/, { timeout: 20000 });
    await page.waitForTimeout(6000);

    expect(statsResponses.length).toBeLessThanOrEqual(2);
    expect(refreshResponses.length).toBeLessThanOrEqual(1);
    expect(websocketAttempts.length).toBeLessThanOrEqual(1);
  });
});
