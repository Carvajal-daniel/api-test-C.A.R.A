import type { CompanyEntity } from "../entities/company.entity.js";
import type { CompanyEmail } from "../value-objects/email.vo.js";


export interface CompaniesRepository {
  existsByEmail(email: CompanyEmail): Promise<boolean>;
  save(company: CompanyEntity): Promise<void>;
}
