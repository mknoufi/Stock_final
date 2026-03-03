export type ProbeRuntimeContext = {
  isWeb: boolean;
  pageProtocol?: string;
};

const HTTP_URL_REGEX = /^http:\/\//i;

export const getProbeRuntimeContext = (): ProbeRuntimeContext => {
  const isWeb = typeof window !== "undefined" && typeof document !== "undefined";
  const pageProtocol = isWeb ? window.location?.protocol : undefined;
  return { isWeb, pageProtocol };
};

export const canProbeCandidateUrl = (
  candidateUrl: string,
  context: ProbeRuntimeContext
): boolean => {
  if (!context.isWeb) return true;
  if ((context.pageProtocol || "").toLowerCase() !== "https:") return true;

  // Secure pages should not attempt plain HTTP backend probes.
  return !HTTP_URL_REGEX.test(candidateUrl);
};

export const buildHealthProbeHeaders = (): Record<string, string> => ({
  Accept: "application/json",
});

