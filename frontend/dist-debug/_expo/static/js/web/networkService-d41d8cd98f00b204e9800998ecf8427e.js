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
  var _reactNativeCommunityNetinfo = require(_dependencyMap[0], "@react-native-community/netinfo");
  var NetInfo = _interopDefault(_reactNativeCommunityNetinfo);
  var _constantsFlags = require(_dependencyMap[1], "../constants/flags");
  var _storeNetworkStore = require(_dependencyMap[2], "../store/networkStore");
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
    if (_constantsFlags.flags.enableNetworkLogging) {
      // Keep logs minimal in production.
      console.log("[NetInfo]", {
        isConnected,
        isInternetReachable: state.isInternetReachable,
        normalizedReachable: reachable,
        type
      });
    }
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
},2008,[1651,1831,1328],"src/services/networkService.ts");
//# sourceMappingURL=http://localhost:8081/index.js.map?platform=web&dev=true&hot=false&transform.routerRoot=app&resolver.exporting=true&serializer.splitChunks=true&serializer.output=static&serializer.map=true
//# debugId=cd0daf33-d14f-4fba-994a-9a99697c1d5f