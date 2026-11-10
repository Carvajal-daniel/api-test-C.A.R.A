import fastify from "fastify";
import cors from "@fastify/cors";
import { UserAppErrors } from "./error-handler.js";
import { ContractRoutes } from "../../modules/Contract/infra/http/routers/contract-routes.js";

const app = fastify({
  logger: true,
});

// Configuração do CORS para que o Lovable/Next.js acesse sua API sem bloqueios
await app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

UserAppErrors(app);
app.register(ContractRoutes);

export { app };
