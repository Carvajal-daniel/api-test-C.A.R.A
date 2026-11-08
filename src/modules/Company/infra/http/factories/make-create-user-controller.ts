import { RegisterCompanyUseCase } from "../../../usecases/register-company.usecase.js";
import { CompanyRepositoryDB } from "../../database/repositories/companies-repository.impl.js";
import { RegisterCompanyController } from "../controllers/register-company.controller.js";

export function MakeCreateController(){
  const repo = new CompanyRepositoryDB()
  const useCase = new RegisterCompanyUseCase(repo)

  return new RegisterCompanyController(useCase)
}