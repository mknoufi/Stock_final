import { createLogger } from "../logging";

const log = createLogger("reactotron");
let initialized = false;

export const initReactotron = async () => {
  if (initialized || !__DEV__) return;
  initialized = true;

  try {
    const moduleName = "reactotron-react-native";
    const reactotronModule = await import(moduleName);
    const reactotron =
      reactotronModule.default || reactotronModule.Reactotron || reactotronModule;

    if (reactotron?.configure && reactotron?.useReactNative && reactotron?.connect) {
      reactotron.configure({ name: "Stock Verify App" }).useReactNative().connect();
      log.info("Reactotron initialized");
      return;
    }

    log.warn("Reactotron package loaded but API surface is unexpected");
  } catch (error) {
    log.info("Reactotron not installed; devtools initialization skipped");
    log.debug("Reactotron init detail", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
