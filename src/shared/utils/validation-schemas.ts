// src/shared/utils/validation-schemas.ts
import { z } from "zod";

// Regras universais isoladas para reaproveitamento
export const nameSchema = z.string().trim().min(2, "Nome inválido.").max(80);
export const companyNameSchema = z.string().trim().min(3, "Nome do estabelecimento inválido.").max(100);
export const phoneSchema = z.string().trim().min(10, "Telefone inválido.").max(20);
export const emailSchema = z.string().trim().toLowerCase().email("E-mail inválido.");
export const passwordSchema = z.string().min(6, "Senha muito curta.").max(15, "Senha muito longa.");

// 📦 O ESQUEMA COMPLETO DO FORMULÁRIO (Universal)
export const registerCompanySchema = z.object({
  companyName: companyNameSchema,
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Tipo TypeScript gerado automaticamente pelo Zod para os DTOs
export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;
