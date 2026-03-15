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
  Object.defineProperty(exports, "initializeNetworkListener", {
    enumerable: true,
    get: function () {
      return initializeNetworkListener;
    }
  });
  var _reactNativeCommunityNetinfo = require(_dependencyMap[0]);
  var NetInfo = _interopDefault(_reactNativeCommunityNetinfo);
  var _constantsFlags = require(_dependencyMap[1]);
  var _storeNetworkStore = require(_dependencyMap[2]);
  function toReachableValue(isConnected, isInternetReachable) {
    // This app commonly runs on a local LAN backend.
    // NetInfo's `isInternetReachable=false` can mean "no internet" while LAN still works.
    // Treat it as UNKNOWN (null) rather than definitively offline.
    if (!isConnected) return null;
    return isInternetReachable === true ? true : null;
  }
  function applyNetInfoState(state) {
    const isConnected = state.isConnected ?? false;
    const reachable = toReachableValue(isConnected, state.isInternetReachable);
    const type = state.type ?? "unknown";
    const store = _storeNetworkStore.useNetworkStore.getState();
    store.setIsOnline(isConnected);
    store.setConnectionType(type);
    store.setIsInternetReachable(reachable);

    // When the network changes, clear restricted mode so the app can re-check.
    // Restricted mode will be re-enabled by the API interceptor if still applicable.
    store.setRestrictedMode(false);
    if (_constantsFlags.flags.enableNetworkLogging) {}
  }
  const initializeNetworkListener = () => {
    // Initialize store from a one-time fetch so we don't depend on the first event.
    NetInfo.default.fetch().then(state => applyNetInfoState(state)).catch(() => {
      // If NetInfo fails, leave defaults; API layer will degrade gracefully.
    });
    const unsubscribe = NetInfo.default.addEventListener(state => {
      applyNetInfoState(state);
    });
    return unsubscribe;
  };
},1926,[1555,1735,1304]);
//# sourceMappingURL=/_expo/static/js/web/networkService-07bd8c75666d50961c0f884e7d571007.js.map
//# debugId=1f763310-78a5-4439-a2c4-1a2f56acd18f