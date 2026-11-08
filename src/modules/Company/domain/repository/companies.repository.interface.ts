import type { CompanyEntity } from "../entities/company.entity.js";


export interface CompaniesRepository {
  existsByEmail(email: string): Promise<boolean>;
  save(company: CompanyEntity): Promise<void>;
}
