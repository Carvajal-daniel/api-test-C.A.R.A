import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { CompaniesRepository } from '../../domain/repository/companies.repository.interface.js';
import { db } from '../../../../shared/database/database.js';
import { CompanyTable } from './schema/companies-schema.js';
import type { CompanyEntity } from '../../domain/entities/company.entity.js';

const PASSWORD_SALT_ROUNDS = 10;

export class CompaniesRepositoryImpl implements CompaniesRepository {
  constructor(private readonly database: typeof db) {}

  async existsByEmail(email: string): Promise<boolean> {
    const [company] = await this.database
      .select({ id: CompanyTable.id })
      .from(CompanyTable)
      .where(eq(CompanyTable.email, email))
      .limit(1);

    return company !== undefined;
  }

  async save(company: CompanyEntity): Promise<void> {
    const hashedPassword = await bcrypt.hash(
      company.password,
      PASSWORD_SALT_ROUNDS,
    );

    await this.database.insert(CompanyTable).values({
      companyName: company.companyName,
      name: company.name,
      phone: company.phone,
      email: company.email,
      password: hashedPassword,
    });
  }
}
