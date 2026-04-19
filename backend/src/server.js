import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(`API executando em http://0.0.0.0:${env.port}`);
  console.log(`Modo de armazenamento: ${env.dataStoreMode}`);
});

server.on("error", (error) => {
  console.error("Falha ao iniciar o servidor:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});
