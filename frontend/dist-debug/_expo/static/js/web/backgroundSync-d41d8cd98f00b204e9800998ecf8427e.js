__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  "use strict";

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = {};
    if (e) Object.keys(e).forEach(function (k) {
      var d = Object.getOwnPropertyDescriptor(e, k);
      Object.defineProperty(n, k, d.get ? d : {
        enumerable: true,
        get: function () {
          return e[k];
        }
      });
    });
    n.default = e;
    return n;
  }
  function _interopDefault(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }
  Object.defineProperty(exports, "registerBackgroundSync", {
    enumerable: true,
    get: function () {
      return registerBackgroundSync;
    }
  });
  Object.defineProperty(exports, "unregisterBackgroundSync", {
    enumerable: true,
    get: function () {
      return unregisterBackgroundSync;
    }
  });
  var _expoBackgroundFetch = require(_dependencyMap[0], "expo-background-fetch");
  var BackgroundFetch = _interopNamespace(_expoBackgroundFetch);
  var _expoTaskManager = require(_dependencyMap[1], "expo-task-manager");
  var TaskManager = _interopNamespace(_expoTaskManager);
  var _reactNativeWebDistExportsPlatform = require(_dependencyMap[2], "react-native-web/dist/exports/Platform");
  var Platform = _interopDefault(_reactNativeWebDistExportsPlatform);
  var _expoConstants = require(_dependencyMap[3], "expo-constants");
  var Constants = _interopDefault(_expoConstants);
  var _syncQueue = require(_dependencyMap[4], "./syncQueue");
  const BACKGROUND_SYNC_TASK = "BACKGROUND_SYNC_TASK";

  /**
   * Define the background task.
   */
  if (Platform.default.OS !== "web" && TaskManager?.defineTask) {
    TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
      try {
        console.log("Background sync task started");
        const result = await _syncQueue.syncQueue.performFullSync();
        console.log("Background sync task completed:", result);
        return result.pushed > 0 || result.pulled > 0 ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
      } catch (error) {
        console.error("Background sync task failed:", error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });
  }

  /**
   * Register the background sync task.
   */
  const registerBackgroundSync = async () => {
    if (Platform.default.OS === "web" || !TaskManager?.isTaskRegisteredAsync) {
      console.log("Background sync is not supported on web");
      return;
    }

    // Expo Go does not support Background Fetch / TaskManager execution.
    // Avoid surfacing this as a fatal runtime error on physical devices.
    if (Constants.default.appOwnership === "expo") {
      console.log("Background sync registration skipped in Expo Go");
      return;
    }
    try {
      // On some iOS configurations (especially on physical devices), background fetch may not be enabled
      // even if the module is installed. Avoid surfacing this as a fatal runtime error.
      try {
        const fetchStatus = await BackgroundFetch.getStatusAsync();
        if (fetchStatus !== BackgroundFetch.BackgroundFetchStatus.Available) {
          console.log("Background fetch not available; skipping background sync registration", {
            status: fetchStatus
          });
          return;
        }
      } catch {
        // If status can't be determined, fall through and attempt registration.
      }
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
      if (isRegistered) {
        console.log("Background sync task already registered");
        return;
      }
      await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
        minimumInterval: 15 * 60,
        // 15 minutes
        stopOnTerminate: false,
        startOnBoot: true
      });
      console.log("Background sync task registered");
    } catch (error) {
      console.error("Failed to register background sync task:", error);
    }
  };

  /**
   * Unregister the background sync task.
   */
  const unregisterBackgroundSync = async () => {
    if (Platform.default.OS === "web" || !BackgroundFetch?.unregisterTaskAsync) return;
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
      console.log("Background sync task unregistered");
    } catch (error) {
      console.error("Failed to unregister background sync task:", error);
    }
  };
},2005,[2020,2021,18,1089,2025],"src/services/backgroundSync.ts");
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  "use strict";

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = {};
    if (e) Object.keys(e).forEach(function (k) {
      var d = Object.getOwnPropertyDescriptor(e, k);
      Object.defineProperty(n, k, d.get ? d : {
        enumerable: true,
        get: function () {
          return e[k];
        }
      });
    });
    n.default = e;
    return n;
  }
  function _interopDefault(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }
  exports.getStatusAsync = getStatusAsync;
  exports.setMinimumIntervalAsync = setMinimumIntervalAsync;
  exports.registerTaskAsync = registerTaskAsync;
  exports.unregisterTaskAsync = unregisterTaskAsync;
  Object.defineProperty(exports, "BackgroundFetchResult", {
    enumerable: true,
    get: function () {
      return _BackgroundFetchTypes.BackgroundFetchResult;
    }
  });
  Object.defineProperty(exports, "BackgroundFetchStatus", {
    enumerable: true,
    get: function () {
      return _BackgroundFetchTypes.BackgroundFetchStatus;
    }
  });
  var _expo = require(_dependencyMap[0], "expo");
  var _expoModulesCore = require(_dependencyMap[1], "expo-modules-core");
  var _expoTaskManager = require(_dependencyMap[2], "expo-task-manager");
  var TaskManager = _interopNamespace(_expoTaskManager);
  var _BackgroundFetchTypes = require(_dependencyMap[3], "./BackgroundFetch.types");
  var _ExpoBackgroundFetch = require(_dependencyMap[4], "./ExpoBackgroundFetch");
  var ExpoBackgroundFetch = _interopDefault(_ExpoBackgroundFetch);
  let didShowDeprecationWarning = false;
  const showDeprecationWarning = () => {
    if (!didShowDeprecationWarning) {
      didShowDeprecationWarning = true;
      console.warn('expo-background-fetch: This library is deprecated. Use expo-background-task instead.');
    }
  };
  let warnedAboutExpoGo = false;
  function _validate(taskName) {
    if ((0, _expo.isRunningInExpoGo)()) {
      if (!warnedAboutExpoGo) {
        const message = '`Background Fetch` functionality is not available in Expo Go:\n' + 'You can use this API, and all others, in a development build. Learn more: https://expo.fyi/dev-client.';
        console.warn(message);
        warnedAboutExpoGo = true;
      }
    }
    if (!taskName || typeof taskName !== 'string') {
      throw new TypeError('`taskName` must be a non-empty string.');
    }
  }
  // @needsAudit
  /**
   * Gets a status of background fetch.
   * @return Returns a promise which fulfils with one of `BackgroundFetchStatus` enum values.
   * @deprecated Use [`getStatusAsync()`](./background-task/#backgroundtaskgetstatusasync) from `expo-background-task`
   * instead. The `expo-background-fetch` package has been deprecated.
   */
  async function getStatusAsync() {
    showDeprecationWarning();
    if (_expoModulesCore.Platform.OS === 'android') {
      return _BackgroundFetchTypes.BackgroundFetchStatus.Available;
    }
    return ExpoBackgroundFetch.default.getStatusAsync();
  }
  // @needsAudit
  /**
   * Sets the minimum number of seconds that must elapse before another background fetch can be
   * initiated. This value is advisory only and does not indicate the exact amount of time expected
   * between fetch operations.
   *
   * > This method doesn't take any effect on Android. It is a global value which means that it can
   * overwrite settings from another application opened through Expo Go.
   *
   * @param minimumInterval Number of seconds that must elapse before another background fetch can be called.
   * @return A promise which fulfils once the minimum interval is set.
   * @deprecated Use the [`registerTaskAsync()`](./background-task#backgroundtaskregistertaskasynctaskname-options) method
   * from expo-background-task package, and specify [`BackgroundTaskOptions`](./background-task/#backgroundtaskoptions)
   * argument instead, when setting task interval time.
   */
  async function setMinimumIntervalAsync(minimumInterval) {
    showDeprecationWarning();
    if (!ExpoBackgroundFetch.default.setMinimumIntervalAsync) {
      return;
    }
    // iOS only
    await ExpoBackgroundFetch.default.setMinimumIntervalAsync(minimumInterval);
  }
  // @needsAudit
  /**
   * Registers background fetch task with given name. Registered tasks are saved in persistent storage and restored once the app is initialized.
   * @param taskName Name of the task to register. The task needs to be defined first - see [`TaskManager.defineTask`](task-manager/#taskmanagerdefinetaskttaskname-taskexecutor)
   * for more details.
   * @param options An object containing the background fetch options.
   *
   * @example
   * ```ts
   * import * as BackgroundFetch from 'expo-background-fetch';
   * import * as TaskManager from 'expo-task-manager';
   *
   * TaskManager.defineTask(YOUR_TASK_NAME, () => {
   *   try {
   *     const receivedNewData = // do your background fetch here
   *     return receivedNewData ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
   *   } catch (error) {
   *     return BackgroundFetch.BackgroundFetchResult.Failed;
   *   }
   * });
   * ```
   * @deprecated Use [`registerTaskAsync()`](./background-task#backgroundtaskregistertaskasynctaskname-options) from `expo-background-task`
   * instead. The `expo-background-fetch` package has been deprecated.
   */
  async function registerTaskAsync(taskName, options = {}) {
    showDeprecationWarning();
    if (!ExpoBackgroundFetch.default.registerTaskAsync) {
      throw new _expoModulesCore.UnavailabilityError('BackgroundFetch', 'registerTaskAsync');
    }
    if (!TaskManager.isTaskDefined(taskName)) {
      throw new Error(`Task '${taskName}' is not defined. You must define a task using TaskManager.defineTask before registering.`);
    }
    _validate(taskName);
    await ExpoBackgroundFetch.default.registerTaskAsync(taskName, options);
  }
  // @needsAudit
  /**
   * Unregisters background fetch task, so the application will no longer be executing this task.
   * @param taskName Name of the task to unregister.
   * @return A promise which fulfils when the task is fully unregistered.
   * @deprecated Use [`unregisterTaskAsync()`](./background-task/#backgroundtaskunregistertaskasynctaskname) from `expo-background-task`
   * instead. The `expo-background-fetch` package has been deprecated.
   */
  async function unregisterTaskAsync(taskName) {
    showDeprecationWarning();
    if (!ExpoBackgroundFetch.default.unregisterTaskAsync) {
      throw new _expoModulesCore.UnavailabilityError('BackgroundFetch', 'unregisterTaskAsync');
    }
    _validate(taskName);
    await ExpoBackgroundFetch.default.unregisterTaskAsync(taskName);
  }
},2020,[995,1047,2021,2023,2024],"node_modules/expo-background-fetch/build/BackgroundFetch.js");
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
  exports.defineTask = defineTask;
  exports.isTaskDefined = isTaskDefined;
  exports.isTaskRegisteredAsync = isTaskRegisteredAsync;
  exports.getTaskOptionsAsync = getTaskOptionsAsync;
  exports.getRegisteredTasksAsync = getRegisteredTasksAsync;
  exports.unregisterTaskAsync = unregisterTaskAsync;
  exports.unregisterAllTasksAsync = unregisterAllTasksAsync;
  exports.isAvailableAsync = isAvailableAsync;
  var _expoModulesCore = require(_dependencyMap[0], "expo-modules-core");
  var _ExpoTaskManager = require(_dependencyMap[1], "./ExpoTaskManager");
  var ExpoTaskManager = _interopDefault(_ExpoTaskManager);
  const tasks = new Map();
  function _validate(taskName) {
    if (!taskName || typeof taskName !== 'string') {
      throw new TypeError('`taskName` must be a non-empty string.');
    }
  }
  // @needsAudit
  /**
   * Defines task function. It must be called in the global scope of your JavaScript bundle.
   * In particular, it cannot be called in any of React lifecycle methods like `componentDidMount`.
   * This limitation is due to the fact that when the application is launched in the background,
   * we need to spin up your JavaScript app, run your task and then shut down — no views are mounted
   * in this scenario.
   *
   * @param taskName Name of the task. It must be the same as the name you provided when registering the task.
   * @param taskExecutor A function that will be invoked when the task with given `taskName` is executed.
   */
  function defineTask(taskName, taskExecutor) {
    if (!taskName || typeof taskName !== 'string') {
      console.warn(`TaskManager.defineTask: 'taskName' argument must be a non-empty string.`);
      return;
    }
    if (!taskExecutor || typeof taskExecutor !== 'function') {
      console.warn(`TaskManager.defineTask: 'task' argument must be a function.`);
      return;
    }
    tasks.set(taskName, taskExecutor);
  }
  // @needsAudit
  /**
   * Checks whether the task is already defined.
   *
   * @param taskName Name of the task.
   */
  function isTaskDefined(taskName) {
    return tasks.has(taskName);
  }
  // @needsAudit
  /**
   * Determine whether the task is registered. Registered tasks are stored in a persistent storage and
   * preserved between sessions.
   *
   * @param taskName Name of the task.
   * @returns A promise which resolves to `true` if a task with the given name is registered, otherwise `false`.
   */
  async function isTaskRegisteredAsync(taskName) {
    if (!ExpoTaskManager.default.isTaskRegisteredAsync) {
      throw new _expoModulesCore.UnavailabilityError('TaskManager', 'isTaskRegisteredAsync');
    }
    _validate(taskName);
    return ExpoTaskManager.default.isTaskRegisteredAsync(taskName);
  }
  // @needsAudit
  /**
   * Retrieves `options` associated with the task, that were passed to the function registering the task
   * (e.g. `Location.startLocationUpdatesAsync`).
   *
   * @param taskName Name of the task.
   * @return A promise which fulfills with the `options` object that was passed while registering task
   * with given name or `null` if task couldn't be found.
   */
  async function getTaskOptionsAsync(taskName) {
    if (!ExpoTaskManager.default.getTaskOptionsAsync) {
      throw new _expoModulesCore.UnavailabilityError('TaskManager', 'getTaskOptionsAsync');
    }
    _validate(taskName);
    return ExpoTaskManager.default.getTaskOptionsAsync(taskName);
  }
  // @needsAudit
  /**
   * Provides information about tasks registered in the app.
   *
   * @returns A promise which fulfills with an array of tasks registered in the app.
   * @example
   * ```js
   * [
   *   {
   *     taskName: 'location-updates-task-name',
   *     taskType: 'location',
   *     options: {
   *       accuracy: Location.Accuracy.High,
   *       showsBackgroundLocationIndicator: false,
   *     },
   *   },
   *   {
   *     taskName: 'geofencing-task-name',
   *     taskType: 'geofencing',
   *     options: {
   *       regions: [...],
   *     },
   *   },
   * ]
   * ```
   */
  async function getRegisteredTasksAsync() {
    if (!ExpoTaskManager.default.getRegisteredTasksAsync) {
      throw new _expoModulesCore.UnavailabilityError('TaskManager', 'getRegisteredTasksAsync');
    }
    return ExpoTaskManager.default.getRegisteredTasksAsync();
  }
  // @needsAudit
  /**
   * Unregisters task from the app, so the app will not be receiving updates for that task anymore.
   * _It is recommended to use methods specialized by modules that registered the task, eg.
   * [`Location.stopLocationUpdatesAsync`](./location/#expolocationstoplocationupdatesasynctaskname)._
   *
   * @param taskName Name of the task to unregister.
   * @return A promise which fulfills as soon as the task is unregistered.
   */
  async function unregisterTaskAsync(taskName) {
    if (!ExpoTaskManager.default.unregisterTaskAsync) {
      throw new _expoModulesCore.UnavailabilityError('TaskManager', 'unregisterTaskAsync');
    }
    _validate(taskName);
    await ExpoTaskManager.default.unregisterTaskAsync(taskName);
  }
  // @needsAudit
  /**
   * Unregisters all tasks registered for the running app. You may want to call this when the user is
   * signing out and you no longer need to track his location or run any other background tasks.
   * @return A promise which fulfills as soon as all tasks are completely unregistered.
   */
  async function unregisterAllTasksAsync() {
    if (!ExpoTaskManager.default.unregisterAllTasksAsync) {
      throw new _expoModulesCore.UnavailabilityError('TaskManager', 'unregisterAllTasksAsync');
    }
    await ExpoTaskManager.default.unregisterAllTasksAsync();
  }
  if (ExpoTaskManager.default) {
    const eventEmitter = new _expoModulesCore.LegacyEventEmitter(ExpoTaskManager.default);
    eventEmitter.addListener(ExpoTaskManager.default.EVENT_NAME, async ({
      data,
      error,
      executionInfo
    }) => {
      const {
        eventId,
        taskName
      } = executionInfo;
      const taskExecutor = tasks.get(taskName);
      let result = null;
      if (taskExecutor) {
        try {
          // Execute JS task
          result = await taskExecutor({
            data,
            error,
            executionInfo
          });
        } catch (error) {
          console.error(`TaskManager: Task "${taskName}" failed:`, error);
        } finally {
          // Notify manager the task is finished.
          await ExpoTaskManager.default.notifyTaskFinishedAsync(taskName, {
            eventId,
            result
          });
        }
      } else {
        console.warn(`TaskManager: Task "${taskName}" has been executed but looks like it is not defined. Make sure that "TaskManager.defineTask" is called during initialization phase.`);
        // No tasks defined -> we need to notify about finish anyway.
        await ExpoTaskManager.default.notifyTaskFinishedAsync(taskName, {
          eventId,
          result
        });
        // We should also unregister such tasks automatically as the task might have been removed
        // from the app or just renamed - in that case it needs to be registered again (with the new name).
        await ExpoTaskManager.default.unregisterTaskAsync(taskName);
      }
    });
  }
  // @needsAudit
  /**
   * Determine if the `TaskManager` API can be used in this app.
   * @return A promise which fulfills with `true` if the API can be used, and `false` otherwise.
   * With Expo Go, `TaskManager` is not available on Android, and does not support background execution on iOS.
   * Use a development build to avoid limitations: https://expo.fyi/dev-client.
   * On the web, it always returns `false`.
   */
  async function isAvailableAsync() {
    return ExpoTaskManager.default.isAvailableAsync();
  }
},2021,[1047,2022],"node_modules/expo-task-manager/build/TaskManager.js");
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  "use strict";

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function () {
      return _default;
    }
  });
  var _default = {
    get EVENT_NAME() {
      return 'TaskManager.executeTask';
    },
    addListener() {},
    removeListeners() {},
    async isAvailableAsync() {
      return false;
    }
  };
},2022,[],"node_modules/expo-task-manager/build/ExpoTaskManager.web.js");
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  "use strict";

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  Object.defineProperty(exports, "BackgroundFetchResult", {
    enumerable: true,
    get: function () {
      return BackgroundFetchResult;
    }
  });
  Object.defineProperty(exports, "BackgroundFetchStatus", {
    enumerable: true,
    get: function () {
      return BackgroundFetchStatus;
    }
  });
  // @needsAudit
  /**
   * This return value is to let iOS know what the result of your background fetch was, so the
   * platform can better schedule future background fetches. Also, your app has up to 30 seconds
   * to perform the task, otherwise your app will be terminated and future background fetches
   * may be delayed.
   */
  var BackgroundFetchResult;
  (function (BackgroundFetchResult) {
    /**
     * There was no new data to download.
     */
    BackgroundFetchResult[BackgroundFetchResult["NoData"] = 1] = "NoData";
    /**
     * New data was successfully downloaded.
     */
    BackgroundFetchResult[BackgroundFetchResult["NewData"] = 2] = "NewData";
    /**
     * An attempt to download data was made but that attempt failed.
     */
    BackgroundFetchResult[BackgroundFetchResult["Failed"] = 3] = "Failed";
  })(BackgroundFetchResult || (BackgroundFetchResult = {}));
  // @needsAudit
  var BackgroundFetchStatus;
  (function (BackgroundFetchStatus) {
    /**
     * The user explicitly disabled background behavior for this app or for the whole system.
     */
    BackgroundFetchStatus[BackgroundFetchStatus["Denied"] = 1] = "Denied";
    /**
     * Background updates are unavailable and the user cannot enable them again. This status can occur
     * when, for example, parental controls are in effect for the current user.
     */
    BackgroundFetchStatus[BackgroundFetchStatus["Restricted"] = 2] = "Restricted";
    /**
     * Background updates are available for the app.
     */
    BackgroundFetchStatus[BackgroundFetchStatus["Available"] = 3] = "Available";
  })(BackgroundFetchStatus || (BackgroundFetchStatus = {}));
},2023,[],"node_modules/expo-background-fetch/build/BackgroundFetch.types.js");
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  "use strict";

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function () {
      return _default;
    }
  });
  var _BackgroundFetchTypes = require(_dependencyMap[0], "./BackgroundFetch.types");
  var _default = {
    async getStatusAsync() {
      return _BackgroundFetchTypes.BackgroundFetchStatus.Restricted;
    }
  };
},2024,[2023],"node_modules/expo-background-fetch/build/ExpoBackgroundFetch.web.js");
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
  Object.defineProperty(exports, "syncQueue", {
    enumerable: true,
    get: function () {
      return syncQueue;
    }
  });
  var _dbLocalDb = require(_dependencyMap[0], "../db/localDb");
  var _apiApi = require(_dependencyMap[1], "./api/api");
  var _httpClient = require(_dependencyMap[2], "./httpClient");
  var api = _interopDefault(_httpClient);
  /**
   * SyncQueue service handles background synchronization of offline data.
   */
  const syncQueue = {
    /**
     * Push pending verifications to the server.
     */
    pushPendingVerifications: async () => {
      if (!(0, _apiApi.isOnline)()) return {
        success: 0,
        failed: 0
      };
      const pending = await (0, _dbLocalDb.getPendingVerifications)();
      if (pending.length === 0) return {
        success: 0,
        failed: 0
      };
      console.log(`Pushing ${pending.length} pending verifications...`);
      const operations = pending.map(p => ({
        id: p.id?.toString() || Date.now().toString(),
        type: "item_verification",
        data: {
          barcode: p.barcode,
          verified: p.verified === 1,
          username: p.username,
          variance: p.variance
        },
        timestamp: p.timestamp
      }));
      try {
        const result = await (0, _apiApi.syncBatch)(operations);

        // Handle successful syncs
        const successfulIds = result.ok || result.processed_ids || [];
        for (const id of successfulIds) {
          await (0, _dbLocalDb.deletePendingVerification)(parseInt(id));
        }

        // Handle conflicts - T077: Use 'Temporary Lock' status
        if (result.conflicts) {
          for (const conflict of result.conflicts) {
            if (conflict.client_record_id) {
              await (0, _dbLocalDb.updatePendingVerificationStatus)(parseInt(conflict.client_record_id), "locked");
              console.log(`Marked verification ${conflict.client_record_id} as locked due to conflict: ${conflict.message}`);
            }
          }
        }
        return {
          success: successfulIds.length,
          failed: pending.length - successfulIds.length
        };
      } catch (error) {
        console.error("Failed to push pending verifications:", error);
        return {
          success: 0,
          failed: pending.length
        };
      }
    },
    /**
     * Pull updated items from the server.
     */
    pullUpdatedItems: async lastSyncTimestamp => {
      if (!(0, _apiApi.isOnline)()) return 0;
      try {
        const response = await api.default.get("/api/v2/erp/items/sync", {
          params: {
            since: lastSyncTimestamp
          }
        });
        const items = response.data.items.map(item => ({
          barcode: item.barcode,
          name: item.item_name,
          category: item.category,
          verified: item.verified ? 1 : 0,
          last_sync: new Date().toISOString()
        }));
        if (items.length > 0) {
          await (0, _dbLocalDb.saveLocalItems)(items);
        }
        return items.length;
      } catch (error) {
        console.error("Failed to pull updated items:", error);
        return 0;
      }
    },
    /**
     * Perform a full sync (push then pull).
     */
    performFullSync: async lastSyncTimestamp => {
      const pushResult = await syncQueue.pushPendingVerifications();
      const pullCount = await syncQueue.pullUpdatedItems(lastSyncTimestamp);
      return {
        pushed: pushResult.success,
        pulled: pullCount
      };
    }
  };
},2025,[1918,1557,1266],"src/services/syncQueue.ts");
//# sourceMappingURL=http://localhost:8081/index.js.map?platform=web&dev=true&hot=false&transform.routerRoot=app&resolver.exporting=true&serializer.splitChunks=true&serializer.output=static&serializer.map=true
//# debugId=6ed6e98a-0e0c-46f9-b6ed-0216fee95b47