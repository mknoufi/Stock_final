__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  "use strict";

  var _s = $RefreshSig$();
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  Object.defineProperty(exports, "initReactotron", {
    enumerable: true,
    get: function () {
      return initReactotron;
    }
  });
  var _expoVirtualEnv = require(_dependencyMap[0], "expo/virtual/env");
  let initialized = false;
  const isReactotronEnabled = () => _expoVirtualEnv.env.EXPO_PUBLIC_ENABLE_REACTOTRON === "true";
  const loadReactotron = () => {
    if (!isReactotronEnabled()) {
      return null;
    }
    try {
      // Reactotron is an optional dev-only dependency, so keep the load dynamic.
      // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies, import/no-unresolved
      const loaded = require(_dependencyMap[1], "reactotron-react-native");
      if (loaded && typeof loaded === "object" && "default" in loaded) {
        return loaded.default ?? null;
      }
      return loaded;
    } catch (error) {
      console.warn("Reactotron package not available, skipping initialization", error);
      return null;
    }
  };
  const initReactotron = async () => {
    _s();
    if (!__DEV__ || initialized) return;
    const Reactotron = loadReactotron();
    if (!Reactotron) {
      return;
    }
    Reactotron.configure({
      name: "Stock Final"
    }).useReactNative().connect();
    if (typeof Reactotron.clear === "function") {
      Reactotron.clear();
    }
    initialized = true;
    console.log("Reactotron initialized");
  };
  _s(initReactotron, "YNGxd3LV4s8IPFWjySBzuaoqPjE=", true);
},2006,[1318,null],"src/services/devtools/reactotron.ts");
//# sourceMappingURL=http://localhost:8081/index.js.map?platform=web&dev=true&hot=false&transform.routerRoot=app&resolver.exporting=true&serializer.splitChunks=true&serializer.output=static&serializer.map=true
//# debugId=dfa5582c-4667-4c35-bbf6-199ab43e2d27