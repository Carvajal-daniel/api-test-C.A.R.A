# 📊 C.A.R.A Soluções - Controle de Saldo de Contratos (Backend)

Este projeto consiste na API de controle financeiro desenvolvida como teste técnico para a vaga de **Desenvolvedor Júnior** na **C.A.R.A Soluções** (Fortaleza). O sistema implementa o gerenciamento de contratos corporativos de TI e o registro de lançamentos/serviços com validação restritiva de saldo em tempo real e análise lógica de indicadores.

## 🏗️ Arquitetura e Decisões de Projeto

O projeto adota os princípios da **Arquitetura Hexagonal (Ports & Adapters)** combinados com conceitos de **Domain-Driven Design (DDD)**. Isso assegura o isolamento completo das regras de negócio de agentes e tecnologias externas:

*   **`domain/` (Core Business)**: Contém o coração da aplicação. As regras de vigência automática e imutabilidade de dados ficam encapsuladas nas entidades (`ContractEntity`, `TransactionEntity`) e nos Value Objects (`Amount`), protegidos por exceções personalizadas de domínio.
*   **`usecases/` (Camada de Aplicação)**: Orquestra o fluxo de dados, aplicando as restrições críticas do sistema como o **Bloqueio de Extrapolação de Saldo** e o cálculo dos indicadores de alerta do Dashboard.
*   **`infra/` (Adaptadores)**: Camada de borda contendo a infraestrutura tecnológica. Implementa os repositórios reais via **Drizzle ORM** (com tipagem estrita), o banco de dados em nuvem serverless **Neon DB (PostgreSQL)** e os adaptadores de entrada HTTP gerenciados pelo **Fastify**.
*   **`factories/` (Injeção de Dependência)**: Centraliza a instanciação manual das dependências das portas de repositórios para os casos de uso e controladores, garantindo baixo acoplamento e inversão de controle (SOLID).

## 🚀 Tecnologias Utilizadas

*   **Node.js & TypeScript** (Configurado com ES Modules via extensões `.js` de importação)
*   **Fastify** (Framework HTTP de alta performance)
*   **Drizzle ORM** (Mapeamento relacional e Type-Safety absoluto)
*   **Neon DB** (Banco de dados PostgreSQL Serverless na nuvem)
*   **Zod** (Validação e tipagem de contratos de dados na borda HTTP)

## 🔧 Como Executar o Projeto Localmente

### 1. Instalar as Dependências
```bash
yarn install
# ou npm install
```

### 2. Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto contendo a string de conexão do PostgreSQL Neon DB:
```env
DATABASE_URL=postgres://seu_usuario:sua_senha@seu_host/neondb?sslmode=require
PORT=3320
```

### 3. Rodar as Migrations do Banco
Atualize a estrutura do seu banco na nuvem criando as tabelas de contratos e transações através do Drizzle Kit:
```bash
npx drizzle-kit generate
yarn db:migrate
```

### 4. Alimentar o Dashboard (Carga Inicial/Seed)
Popule o banco de dados com os cenários simulados exigidos no desafio (Contrato próximo ao limite e Contrato subutilizado):
```bash
yarn db:seed
```

### 5. Iniciar o Servidor de Desenvolvimento
```bash
yarn dev
```
O servidor estará respondendo localmente em `http://localhost:3320`.

## 🧪 Testes Automatizados (Camada de Negócio)

Para garantir o funcionamento pleno das regras financeiras sem dependências externas, os Casos de Uso foram protegidos por testes de unidade estruturados sobre o **Test Runner nativo do Node.js (`node:test`)**:

Para executar a suíte de testes unitários:
```bash
yarn test
```

### Cenários validados nos testes:
1.  **Aprovação Regular**: Permite o salvamento de lançamentos financeiros quando o valor acumulado permanece estritamente dentro do limite total do contrato.
2.  **Bloqueio de Extrapolação**: Dispara um erro `InsufficientBalanceError` na camada de negócio e aborta a operação caso (Lançamentos Atuais + Novo Valor) ultrapasse o teto do contrato.
3.  **Alertas do Dashboard**: Valida as regras matemáticas temporais e de saldo do painel, ativando `nearLimit` (consumo >= 80%) e `underutilized` (consumo < 20% após 50% da vigência decorrida).

## 🌐 Deploy em Produção

A API foi publicada com sucesso em ambiente Serverless na **Vercel** com suporte a rotas redirecionadas.
*   **URL de Produção**: `https://api-test-311guenf2-danielcarvajaldev-4730s-projects.vercel.app/`
