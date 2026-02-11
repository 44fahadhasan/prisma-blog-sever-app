import app from "./app";
import config from "./config";
import { prisma } from "./config/prisma";

(async () => {
  try {
    await prisma.$connect();

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Server start failed:", err);

    prisma.$disconnect();
    process.exit(1);
  }
})();
