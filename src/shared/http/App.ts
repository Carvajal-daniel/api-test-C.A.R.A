import fastify from "fastify";
import { ComapnyRoutes } from "../../modules/Company/infra/http/routers/company-routes.js";

const app = fastify({
  logger: true,
});

app.register(ComapnyRoutes);

export { app };