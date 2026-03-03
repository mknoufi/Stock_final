import { describe, expect, it } from "@jest/globals";

import { buildHealthProbeHeaders, canProbeCandidateUrl } from "../connectionPolicy";

describe("connectionPolicy", () => {
  it("skips http candidates when app is running on secure web", () => {
    const canProbe = canProbeCandidateUrl("http://stock-verify.local:8001", {
      isWeb: true,
      pageProtocol: "https:",
    });

    expect(canProbe).toBe(false);
  });

  it("allows https candidates when app is running on secure web", () => {
    const canProbe = canProbeCandidateUrl("https://stock.lavanyaemart.app", {
      isWeb: true,
      pageProtocol: "https:",
    });

    expect(canProbe).toBe(true);
  });

  it("does not send non-simple headers in health probe", () => {
    const headers = buildHealthProbeHeaders();

    expect(headers).toEqual({
      Accept: "application/json",
    });
  });
});
