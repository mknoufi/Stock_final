import { Platform } from "react-native";

export function initMonitoringAndDevTools(isDev: boolean): void {
  import("../services/sentry")
    .then(({ initSentry }) => {
      initSentry();
    })
    .catch((e) => {
      if (isDev) {
        console.warn("Sentry init failed", e);
      }
    });

  if (!isDev) {
    return;
  }

  import("../services/devtools/reactotron")
    .then(({ initReactotron }) => {
      initReactotron();
    })
    .catch((e) => {
      console.warn("Reactotron init failed", e);
    });

  if (Platform.OS === "web") {
    import("react-scan")
      .then(({ scan }) => {
        scan({ enabled: true, log: true });
      })
      .catch((e) => {
        console.warn("React Scan init failed", e);
      });
  }
}

