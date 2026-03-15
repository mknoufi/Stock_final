__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  "use strict";

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  function _interopDefault(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }
  Object.defineProperty(exports, "initSentry", {
    enumerable: true,
    get: function () {
      return initSentry;
    }
  });
  Object.defineProperty(exports, "captureException", {
    enumerable: true,
    get: function () {
      return captureException;
    }
  });
  var _expoConstants = require(_dependencyMap[0]);
  var Constants = _interopDefault(_expoConstants);
  require(_dependencyMap[1]);
  let runtimeConfig = null;
  let initAttempted = false;
  const normalizeRelease = () => {
    const appVersion = Constants.default.expoConfig?.version || "0.0.0";
    const runtimeCandidate = Constants.default.expoConfig?.runtimeVersion;
    const runtimeVersion = typeof runtimeCandidate === "string" ? runtimeCandidate : "dev";
    return `stock-final@${appVersion}+${runtimeVersion}`;
  };
  const buildEnvelopeUrl = dsn => {
    try {
      const parsed = new URL(dsn);
      const path = parsed.pathname.replace(/\/+$/, "");
      const pathParts = path.split("/").filter(Boolean);
      const projectId = pathParts[pathParts.length - 1];
      if (!projectId) {
        return null;
      }
      const basePath = pathParts.slice(0, -1).join("/");
      const prefix = basePath ? `/${basePath}` : "";
      return `${parsed.protocol}//${parsed.host}${prefix}/api/${projectId}/envelope/`;
    } catch {
      return null;
    }
  };
  const generateEventId = () => Array.from({
    length: 32
  }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const parseStackFrames = stack => {
    if (!stack) return [];
    const lines = stack.split("\n").map(line => line.trim()).filter(Boolean);
    return lines.slice(1).map(line => ({
      function: line
    }));
  };
  const initSentry = () => {
    if (initAttempted) return;
    initAttempted = true;
    const dsn = undefined?.trim();
    if (!dsn) {
      return;
    }
    const envelopeUrl = buildEnvelopeUrl(dsn);
    if (!envelopeUrl) {
      return;
    }
    runtimeConfig = {
      dsn,
      envelopeUrl,
      environment: "production",
      release: normalizeRelease()
    };
  };
  const sendSentryEvent = async (error, context) => {
    if (!runtimeConfig) {
      return;
    }
    const eventId = generateEventId();
    const timestamp = new Date().toISOString();
    const stackFrames = parseStackFrames(error.stack);
    const envelopeHeader = JSON.stringify({
      event_id: eventId,
      sent_at: timestamp,
      dsn: runtimeConfig.dsn,
      sdk: {
        name: "stock-final-frontend",
        version: "1.0.0"
      }
    });
    const itemHeader = JSON.stringify({
      type: "event"
    });
    const eventPayload = JSON.stringify({
      event_id: eventId,
      timestamp,
      platform: "javascript",
      level: "error",
      environment: runtimeConfig.environment,
      release: runtimeConfig.release,
      logger: "frontend",
      tags: {
        platform: "web"
      },
      exception: {
        values: [{
          type: error.name || "Error",
          value: error.message || "Unknown error",
          stacktrace: stackFrames.length > 0 ? {
            frames: stackFrames
          } : undefined
        }]
      },
      extra: context || {}
    });
    const body = `${envelopeHeader}\n${itemHeader}\n${eventPayload}`;
    await fetch(runtimeConfig.envelopeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope"
      },
      body
    });
  };
  const captureException = (error, context) => {
    if (!initAttempted) {
      initSentry();
    }
    void sendSentryEvent(error, context).catch(sendError => {});
  };
},1922,[780,17]);
//# sourceMappingURL=/_expo/static/js/web/sentry-37bd92d643b0be7bdf6797ed7a2ac167.js.map
//# debugId=87f91899-21af-415d-b62e-74b3fa0c040d