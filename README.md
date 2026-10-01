# TelemetryLab — Micro Agents

Este diretório define os micro agentes responsáveis por construir o TelemetryLab.

## Agentes

- `orchestrator.md` — coordena o trabalho e divide tarefas.
- `backend-agent.md` — backend, PostgreSQL, testes unitários e integração.
- `frontend-agent.md` — React, TypeScript e UI/UX.
- `devops-agent.md` — containers, CI/CD, observabilidade e produção.
- `shared-rules.md` — regras obrigatórias para todos os agentes.

## Filosofia

Os agentes devem:

- aplicar Clean Code, SOLID, RESTful APIs e padrões de projeto de forma pragmática;

1. trabalhar com tarefas pequenas e verificáveis;
2. evitar alterações fora do próprio escopo;
3. implementar;
4. executar testes e validações;
5. corrigir os erros encontrados;
6. somente considerar uma tarefa concluída quando a validação passar;
7. priorizar soluções simples, eficientes e adequadas para produção;
8. evitar dependências desnecessárias e código excessivamente verboso;
9. documentar decisões importantes;
10. preservar compatibilidade entre backend, frontend e infraestrutura.

## Stack principal proposta

### Backend

- Node.js LTS
- TypeScript
- Fastify
- PostgreSQL
- Drizzle ORM
- Zod
- Vitest
- Testcontainers
- OpenAPI

### Frontend

- React
- TypeScript
- Vite
- TanStack Query
- React Router
- Zustand apenas quando necessário
- React Hook Form
- Zod
- ECharts ou Plotly para telemetria
- Vitest
- React Testing Library
- Playwright

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- PostgreSQL
- Nginx ou Caddy quando necessário
- OpenTelemetry
- Prometheus/Grafana quando o estágio do projeto justificar
- deploy inicialmente em infraestrutura simples e reproduzível

## Regra central

O TelemetryLab é um sistema de análise de telemetria para motorsport e não deve ser acoplado exclusivamente a kart, carro ou MyChron.

O domínio deve permitir:

- diferentes veículos;
- diferentes dispositivos;
- diferentes canais de telemetria;
- novos formatos de importação no futuro.

# TelemetryLab
# TelemetryLab
# TelemetryLab
