let initialized = false;

export async function register() {
  if (initialized) return;
  initialized = true;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logMemory, logKeys } = await import("./instrumentation.node");
    // logKeys();
    logMemory(); // log on startup
    const interval = setInterval(logMemory, 60 * 60 * 1000); // every hour
    interval.unref();
  }
}
