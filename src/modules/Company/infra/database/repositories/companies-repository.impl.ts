
import { eq } from "drizzle-orm";
import { db } from "../../../../../shared/database/database.js";

import { CompanyTable } from "../schema/companies-schema.js";
import type { CompanyEntity } from "../../../domain/entities/company.entity.js";
import type { CompaniesRepository } from "../../../domain/repository/companies.repository.interface.js";

export class CompanyRepositoryDB implements CompaniesRepository {
  
  async save(company: CompanyEntity): Promise<void> {
    await db
      .insert(CompanyTable)
      .values({
        id: company.id,
        companyName: company.companyName,
        name: company.name,
        phone: company.phone,
        email: company.email,
        password: company.password,
        isActive: company.isActive,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      });
  }

  async existsByEmail(email: string): Promise<boolean> {

    const result = await db
      .select({ id: CompanyTable.id })
      .from(CompanyTable)
      .where(eq(CompanyTable.email, email))
      .limit(1);

    return result.length > 0;
  }
}
