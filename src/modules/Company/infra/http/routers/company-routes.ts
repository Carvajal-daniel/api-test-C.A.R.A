import type { FastifyInstance } from "fastify";
import { MakeCreateController } from "../factories/make-create-user-controller.js";

const createCompanyController = MakeCreateController()

export async function ComapnyRoutes(app: FastifyInstance){
    app.post("/companies", createCompanyController.handle.bind(createCompanyController) )
}