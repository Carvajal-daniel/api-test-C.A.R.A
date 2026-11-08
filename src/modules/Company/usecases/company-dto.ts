export interface RegisterCompanyInputDTO {
  companyName: string;
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface RegisterCompanyOutputDTO {
  id: string;
  companyName: string;
  email: string;
}