import { boolean, pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";

export const CompanyTable = pgTable("companies", { 
  // Alterado para UUID automático do Postgres para evitar conflitos e IDs previsíveis
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Nome da Barbearia*
  companyName: text("company_name").notNull(),
  
  // Nome do contato*
  name: text("name").notNull(),
  
  // Celular do Contato* (Na imagem tem a bandeira do país, ideal salvar formato internacional)
  phone: text("phone").notNull(),
  
  // E-mail Para Acesso*
  email: text("email").notNull().unique(),
  
  // Senha (Mínimo de 6 e máximo de 15 caracteres)* -> Salvaremos o Hash
  password: text("password").notNull(),
  
  // Status do cadastro / Ativo para login
  isActive: boolean("is_active").default(true).notNull(),
  
  // Auditoria (Garantindo Timezone para o cenário de Maturín/Venezuela VET UTC-4)
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    // Índice essencial para validar duplicidade de e-mail no login ou novo cadastro
    emailUniqueIdx: index("companies_email_idx").on(table.email),
  };
});
