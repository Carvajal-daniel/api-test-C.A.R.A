import { CompanyEntity, type CompanyProps } from "../../../domain/entities/company.entity.js";
import { ComapnyEmail } from "../../../domain/value-objects/email.vo.js";
import { Password } from "../../../domain/value-objects/password.vo.js";
import type { CompanyTable } from "../schema/companies-schema.js";

export class CompanyMapper {
  // Converte a Entidade de Domínio para o formato que vai ser inserido no Postgres pelo Drizzle
  static toPersistence(entity: CompanyEntity): typeof CompanyTable.$inferInsert {
    return {
      id: entity.id,
      companyName: entity.companyName,
      name: entity.name,
      phone: entity.phone,
      email: entity.email,
      password: entity.password,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  // Converte os dados brutos vindos do banco de dados de volta para a sua Entidade Rica
  static toDomain(raw: typeof CompanyTable.$inferSelect): CompanyEntity {
    const props: CompanyProps = {
      id: raw.id,
      companyName: raw.companyName,
      name: raw.name,
      phone: raw.phone,
      email: ComapnyEmail.create(raw.email),       // Re-instancia o seu VO rodando as validações
      password: Password.create(raw.password), // Re-instancia o seu VO rodando as validações
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };

    return CompanyEntity.create(props);
  }
}