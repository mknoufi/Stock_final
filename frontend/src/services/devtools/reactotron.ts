let initialized = false;

export const initReactotron = async (): Promise<void> => {
  if (!__DEV__ || initialized) return;

  try {
    const [{ default: Reactotron }] = await Promise.all([
      import("reactotron-react-native"),
    ]);

    Reactotron.configure({ name: "Stock Final" })
      .useReactNative()
      .connect();

    if (typeof Reactotron.clear === "function") {
      Reactotron.clear();
    }

    initialized = true;
    console.log("Reactotron initialized");
  } catch (error) {
    console.warn("Reactotron not available, skipping initialization", error);
  }
};
