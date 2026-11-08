
import type { ComapnyEmail } from '../value-objects/email.vo.js';
import type { Password } from '../value-objects/password.vo.js';


export interface CompanyProps {
  id: string; 
  companyName: string;
  name: string;
  phone: string;
  email: ComapnyEmail;      
  password: Password;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CompanyEntity {
  private constructor(
    private readonly props: CompanyProps
  ) {}

  
  static create(props: CompanyProps): CompanyEntity {
    return new CompanyEntity(props);
  }

  // 🛡️ Getters públicos expondo primitivos/valores limpos para os Casos de Uso e Reposórios
  get id(): string { return this.props.id; }
  get companyName(): string { return this.props.companyName; }
  get name(): string { return this.props.name; }
  get phone(): string { return this.props.phone; }
  get email(): string { return this.props.email.value; }
  get password(): string { return this.props.password.value; }
  get isActive(): boolean { return this.props.isActive; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}
