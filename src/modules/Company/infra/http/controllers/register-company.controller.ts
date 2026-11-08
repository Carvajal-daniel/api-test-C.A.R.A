
import type { FastifyRequest, FastifyReply } from "fastify";
import type { RegisterCompanyUseCase } from "../../../usecases/register-company.usecase.js";
import { registerCompanySchema } from "../../../../../shared/utils/validation-schemas.js";

export class RegisterCompanyController {
  constructor(private readonly registerUseCase: RegisterCompanyUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
 
    try {
          const validatedData = registerCompanySchema.parse(request.body);

   
          const result = await this.registerUseCase.execute(validatedData);
          return reply.status(201).send(result); 
    } catch (error) {
      console.error("ERRO DETALHADO AQUI:", error) 

    return reply
      .status(400)
      .send(error)
    }
    }



  
}
