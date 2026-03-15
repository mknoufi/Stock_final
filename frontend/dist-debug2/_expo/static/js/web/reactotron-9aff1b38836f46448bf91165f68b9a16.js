__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  "use strict";

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  Object.defineProperty(exports, "initReactotron", {
    enumerable: true,
    get: function () {
      return initReactotron;
    }
  });
  let initialized = false;
  const isReactotronEnabled = () => false;
  const loadReactotron = () => {
    if (!isReactotronEnabled()) {
      return null;
    }
    try {
      // Reactotron is an optional dev-only dependency, so keep the load dynamic.
      // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies, import/no-unresolved
      const loaded = require(_dependencyMap[0], "reactotron-react-native");
      if (loaded && typeof loaded === "object" && "default" in loaded) {
        return loaded.default ?? null;
      }
      return loaded;
    } catch (error) {
      return null;
    }
  };
  const initReactotron = async () => {
    return;
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
  };
},1924,[null]);
//# sourceMappingURL=/_expo/static/js/web/reactotron-9aff1b38836f46448bf91165f68b9a16.js.map
//# debugId=2605819a-0688-4619-9464-d07f8fb9e75d