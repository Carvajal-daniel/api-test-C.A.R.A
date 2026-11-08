// src/modules/Company/Application/use-case/company-use-case.ts
import type { RegisterCompanyInput } from '../../../shared/utils/validation-schemas.js';
import { CompanyEntity, type CompanyProps } from '../domain/entities/company.entity.js';
import type { CompaniesRepository } from '../domain/repository/companies.repository.interface.js';
import { ComapnyEmail } from '../domain/value-objects/email.vo.js';
import { Password } from '../domain/value-objects/password.vo.js';



export class CompanyEmailAlreadyInUseError extends Error {
  constructor() {
    super('Este e-mail já está cadastrado.');
    this.name = 'CompanyEmailAlreadyInUseError';
  }
}

export class RegisterCompanyUseCase {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async execute(data: RegisterCompanyInput): Promise<{ id: string }> {
    // 1. Instancia os Value Objects passando o dado que já veio limpo pelo Zod universal
    const emailVO = ComapnyEmail.create(data.email);
    const passwordVO = Password.create(data.password);

    // 2. Monta as propriedades da entidade direto, sem repetição de código
    const companyProps: CompanyProps = {
      id: crypto.randomUUID(),
      companyName: data.companyName,
      name: data.name,
      phone: data.phone,
      email: emailVO,
      password: passwordVO,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const company = CompanyEntity.create(companyProps);

    // 3. Regra de negócio: Checa se o e-mail já existe
    const emailExists = await this.companiesRepository.existsByEmail(company.email);
    if (emailExists) {
      throw new CompanyEmailAlreadyInUseError();
    }

    await this.companiesRepository.save(company);

    return { id: company.id };
  }
}
