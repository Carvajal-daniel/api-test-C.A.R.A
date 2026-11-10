import { app } from "./App.js";
import "dotenv/config.js";

const PORT = Number(process.env.PORT || 3908);

export async function start(): Promise<void> {
  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    app.log.info(`Server is running on port ${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exitCode = 1;
  }
}

void start();

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}
