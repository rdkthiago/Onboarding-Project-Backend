# Onboarding API (Backend)

Esta é a API RESTful responsável por gerenciar o fluxo de cadastro (Onboarding) de novos usuários. Desenvolvida com foco em **Clean Code**, **SOLID** e **Alta Disponibilidade**, a aplicação garante persistência incremental de dados, segurança com MFA e rotinas automatizadas para recuperação de cadastros abandonados.

## Tecnologias Utilizadas

* **Framework:** [NestJS](https://nestjs.com/) (Node.js v20+)
* **Banco de Dados:** PostgreSQL
* **ORM:** TypeORM
* **Infraestrutura:** Docker & Docker Compose (Imagens Alpine)
* **Documentação:** Swagger (OpenAPI)
* **Testes:** Jest
* **Padronização:** ESLint + Prettier configurados em modo estrito

## Arquitetura e Decisões Técnicas

O projeto foi estruturado para ser escalável e de fácil manutenção:
* **Separação de Responsabilidades:** Toda a regra de negócio está encapsulada nos `Services`, mantendo os `Controllers` limpos.
* **Inversão de Dependência (SOLID):** Integrações externas (ViaCEP e Resend) foram abstraídas através de interfaces (`ICepProvider`, `IMailProvider`). Isso permite a troca de fornecedores sem alterar o core da aplicação.
* **Persistência Incremental:** Os dados são salvos a cada etapa concluída via requisições `PATCH`.
* **Recuperação de Abandono (CronJob):** Uma rotina assíncrona (`@nestjs/schedule`) verifica periodicamente cadastros não concluídos e dispara e-mails de engajamento.
* **Segurança Estrita:** Validação rigorosa de DTOs com `class-validator` e tipagem forte TypeScript (sem uso de `any`).

## Pré-requisitos

Para rodar o projeto de forma automatizada, você precisará ter instalado em sua máquina:
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)

## Como Executar (Recomendado via Docker)

A aplicação foi "dockerizada" para facilitar a avaliação, subindo o Banco de Dados e a API simultaneamente em containers isolados.

**1. Clone o repositório**
```bash
git clone https://github.com/rdkthiago/Onboarding-Project-Backend.git
cd onboarding-backend
```

**2. Configure as Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais, especialmente a chave do Resend:
```
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=onboarding_db
RESEND_API_KEY=sua_chave_aqui
```

**3. Suba os containers**
docker-compose up -d --build

*(O parâmetro `-d` roda os containers em segundo plano. A API estará disponível na porta `3000` e o PostgreSQL na porta `5433` para acesso externo).*

## Documentação da API (Swagger)

Com a aplicação rodando, acesse o link abaixo no seu navegador para visualizar o contrato completo da API, testar os endpoints e ver os schemas (DTOs):

 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

## Como Rodar os Testes e Linter

Se desejar rodar a aplicação e os testes localmente (sem Docker), certifique-se de ter o Node 20+ instalado e execute:

# Instalar dependências
npm install

# Rodar a suíte de testes unitários (Services e Controllers)
npm run test

# Checar padronização de código
npm run lint

## Como Testar o E-mail de Abandono Rapidamente

Por questão de testes, a rotina de verificação de abandono (`CronJob`) roda a cada 1 minuto e busca usuários inativos há mais de 1 minuto. Esse tempo pode ser alterado seguindo os passos abaixo.

Basta abrir o arquivo `src/registration/registration.service.ts` e alterar **duas linhas** no final do arquivo (no método `handleAbandonmentEmails`):

**1. Altere o tempo do Cron (Exemplo 1 hora):**
De: `@Cron(CronExpression.EVERY_MINUTE)`
Para: `@Cron(CronExpression.EVERY_HOUR)`

**2. Altere a regra de inatividade:**
De: `const oneHourAgo = new Date(Date.now() - 1 * 60 * 1000);`
Para: `const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);`