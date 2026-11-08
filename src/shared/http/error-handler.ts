import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../Errors/app-errors.js";

export async function UserAppErrors(app: FastifyInstance){
  app.setErrorHandler((error: Error, _: FastifyRequest, reply: FastifyReply) =>{
      if(error instanceof AppError){
          return reply.status(error.statusCode).send({
            message: error.message
          })
      }

      console.log(error)

      return reply.status(500).send({
        message: "Internal server error"
      })
  })
}