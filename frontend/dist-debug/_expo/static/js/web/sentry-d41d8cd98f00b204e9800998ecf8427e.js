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
  var _expoVirtualEnv = require(_dependencyMap[0], "expo/virtual/env");
  var _expoConstants = require(_dependencyMap[1], "expo-constants");
  var Constants = _interopDefault(_expoConstants);
  var _reactNativeWebDistExportsPlatform = require(_dependencyMap[2], "react-native-web/dist/exports/Platform");
  var Platform = _interopDefault(_reactNativeWebDistExportsPlatform);
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
    const dsn = _expoVirtualEnv.env.EXPO_PUBLIC_SENTRY_DSN?.trim();
    if (!dsn) {
      return;
    }
    const envelopeUrl = buildEnvelopeUrl(dsn);
    if (!envelopeUrl) {
      console.warn("Sentry disabled: invalid EXPO_PUBLIC_SENTRY_DSN format");
      return;
    }
    runtimeConfig = {
      dsn,
      envelopeUrl,
      environment: _expoVirtualEnv.env.EXPO_PUBLIC_APP_ENV || process.env.NODE_ENV || "development",
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
        platform: Platform.default.OS
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
    void sendSentryEvent(error, context).catch(sendError => {
      if (__DEV__) {
        console.warn("Sentry send failed", sendError);
      }
    });
  };
},2004,[1318,1089,18],"src/services/sentry.ts");
//# sourceMappingURL=http://localhost:8081/index.js.map?platform=web&dev=true&hot=false&transform.routerRoot=app&resolver.exporting=true&serializer.splitChunks=true&serializer.output=static&serializer.map=true
//# debugId=91ffaf1c-f2ca-4382-930b-f849f7e34650