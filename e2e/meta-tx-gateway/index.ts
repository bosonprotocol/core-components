import { startApp } from "./src/app";

(async () => {
  try {
    startApp();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
