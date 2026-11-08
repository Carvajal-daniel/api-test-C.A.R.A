// src/modules/Company/Infrastructure/database/repositories/company-repository-db.ts
import { eq } from "drizzle-orm";
import { db } from "../../../../../shared/database/database.js";
import type { CompanyEntity } from "../../../domain/entities/company.entity.js";
import { CompanyTable } from "../schema/companies-schema.js";

export class CompanyRepositoryDB implements CompanyRepositoryDB {
  
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
