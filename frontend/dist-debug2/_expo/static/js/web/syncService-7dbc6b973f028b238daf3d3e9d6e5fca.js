__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  "use strict";

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.startSyncService = startSyncService;
  exports.stopSyncService = stopSyncService;
  var _syncService = require(_dependencyMap[0]);
  var _logging = require(_dependencyMap[1]);
  var _storeSettingsStore = require(_dependencyMap[2]);
  const log = (0, _logging.createLogger)("offlineSyncService");
  const DEFAULT_INTERVAL_MS = 900000;
  let intervalId = null;
  let settingsUnsubscribe = null;
  const getIntervalMs = overrideIntervalMs => {
    if (typeof overrideIntervalMs === "number") {
      return overrideIntervalMs;
    }
    const minutes = _storeSettingsStore.useSettingsStore.getState().settings.autoSyncInterval;
    return Math.max(5, minutes) * 60 * 1000;
  };
  const clearSyncInterval = () => {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  };
  function startSyncService(options) {
    const runImmediately = options?.runImmediately ?? true;
    const run = () => {
      (0, _syncService.syncOfflineQueue)({
        background: true
      }).catch(error => {
        const message = error instanceof Error ? error.message : String(error);
        log.warn("Background sync failed", {
          error: message
        });
      });
    };
    const restart = shouldRunImmediately => {
      clearSyncInterval();
      const {
        autoSyncEnabled,
        offlineMode
      } = _storeSettingsStore.useSettingsStore.getState().settings;
      if (!autoSyncEnabled || offlineMode) {
        log.debug("Periodic sync disabled by user settings");
        return;
      }
      const intervalMs = getIntervalMs(options?.intervalMs) || DEFAULT_INTERVAL_MS;
      if (shouldRunImmediately) {
        run();
      }
      intervalId = setInterval(run, intervalMs);
      log.debug("Started periodic sync service", {
        intervalMs
      });
    };
    restart(runImmediately);
    if (!settingsUnsubscribe) {
      settingsUnsubscribe = _storeSettingsStore.useSettingsStore.subscribe((state, previousState) => {
        const current = state.settings;
        const previous = previousState.settings;
        if (current.autoSyncEnabled === previous.autoSyncEnabled && current.autoSyncInterval === previous.autoSyncInterval && current.offlineMode === previous.offlineMode) {
          return;
        }
        restart(current.autoSyncEnabled && !current.offlineMode && (!previous.autoSyncEnabled || previous.offlineMode));
      });
    }
  }
  function stopSyncService() {
    clearSyncInterval();
    if (settingsUnsubscribe) {
      settingsUnsubscribe();
      settingsUnsubscribe = null;
    }
  }
},1928,[1571,1294,1312]);
//# sourceMappingURL=/_expo/static/js/web/syncService-7dbc6b973f028b238daf3d3e9d6e5fca.js.map
//# debugId=63d6bb84-dccd-4ffc-9ade-b46d6dbe9867