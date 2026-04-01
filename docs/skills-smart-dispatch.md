# VSA Smart Dispatch — Documentação de Skills

> **Contexto:** Este documento descreve as Skills do sistema `superpowers/` utilizadas para desenvolvimento autônomo e inteligente do VSA Smart Assist. Inclui User Stories no estilo XP (Extreme Programming) que guiam a implementação e o comportamento esperado de cada skill.

---

## Sumário

1. [O que são Skills?](#o-que-são-skills)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [VSA Smart Dispatch — User Stories (XP Style)](#vsa-smart-dispatch--user-stories-xp-style)
4. [Skills Catalog](#skills-catalog)
   - [smart-dispatch](#smart-dispatch)
   - [brainstorming](#brainstorming)
   - [writing-plans](#writing-plans)
   - [subagent-driven-development](#subagent-driven-development)
   - [test-driven-development](#test-driven-development)
   - [systematic-debugging](#systematic-debugging)
   - [writing-skills](#writing-skills)
5. [Como Usar as Skills no VSA Smart Assist](#como-usar-as-skills-no-vsa-smart-assist)
6. [Fluxo de Roteamento de Modelos](#fluxo-de-roteamento-de-modelos)

---

## O que são Skills?

Skills são **módulos de comportamento reutilizáveis** que instruem o agente de IA como executar tipos específicos de trabalho de desenvolvimento. Cada skill é uma pasta com um arquivo `SKILL.md` que contém:

- Frontmatter YAML com `name` e `description`
- Instruções detalhadas em Markdown
- Exemplos do mundo real
- Critérios de ativação (triggers)

O agente lê o `SKILL.md` antes de executar qualquer tarefa coberta pela skill, garantindo comportamento consistente e de alta qualidade.

---

## Estrutura de Pastas

```
superpowers/
├── skills/                          # Implementações de skills (uma pasta por skill)
│   ├── brainstorming/               # Refinamento de design (ativa no planejamento de features)
│   ├── writing-plans/               # Planejamento de implementação (cria breakdown de tasks)
│   ├── subagent-driven-development/ # Execução autônoma de tarefas
│   ├── test-driven-development/     # Ciclo RED-GREEN-REFACTOR
│   ├── systematic-debugging/        # Workflow de análise de causa raiz
│   ├── smart-dispatch/              # Roteamento de modelos (Opus/Sonnet/Haiku em paralelo)
│   └── writing-skills/             # Criação e iteração de skills (meta-skill)
```

Cada pasta de skill pode conter:
- **`SKILL.md`** _(obrigatório)_ — Instruções principais com frontmatter YAML e markdown
- **`scripts/`** — Scripts auxiliares e utilitários
- **`examples/`** — Implementações de referência e padrões de uso
- **`resources/`** — Arquivos adicionais, templates ou assets

---

## VSA Smart Dispatch — User Stories (XP Style)

As User Stories abaixo seguem o formato clássico do Extreme Programming:

> **Como** `[papel]`, **eu quero** `[ação/funcionalidade]`, **para que** `[benefício/valor]`.

Cada história inclui **Critérios de Aceitação (ACs)** claros e **Notas de Implementação** para o agente.

---

### EP-01 — Roteamento Inteligente de Modelos

#### US-01.1 — Despacho por Complexidade

> **Como** desenvolvedor usando o VSA Smart Assist,  
> **eu quero** que tarefas de desenvolvimento sejam roteadas automaticamente para o modelo de IA mais adequado (Opus/Sonnet/Haiku),  
> **para que** eu economize tempo e custo sem sacrificar qualidade.

**Critérios de Aceitação:**
- [ ] Tarefas de arquitetura e design vão para **Opus**
- [ ] Implementações de componentes e lógica de negócio vão para **Sonnet**
- [ ] Tarefas mecânicas e repetitivas (estilos, i18n, testes boilerplate) vão para **Haiku**
- [ ] O agente exibe o plano de dispatch antes de executar
- [ ] Tarefas independentes executam em **paralelo**

**Notas de Implementação:**
- Lê `CLAUDE.md` para entender a arquitetura do VSA Smart Assist
- Usa a skill `smart-dispatch` para criar o plano
- Exige aprovação do desenvolvedor antes do dispatch

---

#### US-01.2 — Transparência no Plano de Execução

> **Como** desenvolvedor,  
> **eu quero** ver o plano de dispatch detalhado antes da execução,  
> **para que** eu possa revisar e corrigir decisões de roteamento antes que código seja gerado.

**Critérios de Aceitação:**
- [ ] O plano lista cada subtask com o modelo designado (Opus/Sonnet/Haiku)
- [ ] O plano indica quais tasks rodam em paralelo e quais são sequenciais
- [ ] O desenvolvedor pode editar ou rejeitar o plano antes de aprovar
- [ ] O agente aguarda aprovação explícita antes de iniciar o dispatch

**Exemplo de Plano:**
```
DISPATCH PLAN: Adicionar Relatórios de Chamados

[Opus]   Projetar arquitetura de dados e layout da página
[Sonnet] Implementar ReportsPage.tsx + filtros de data
[Sonnet] Implementar useReportMetrics.ts + agregação de dados  ← paralelo
[Haiku]  Gerar estilos + i18n + mocks de teste               ← paralelo
```

---

#### US-01.3 — Execução Paralela de Sub-tarefas

> **Como** desenvolvedor,  
> **eu quero** que sub-tarefas independentes sejam executadas em paralelo,  
> **para que** o tempo total de desenvolvimento seja reduzido significativamente.

**Critérios de Aceitação:**
- [ ] Tasks Sonnet sem dependências entre si executam simultaneamente
- [ ] Tasks Haiku (estilos, i18n, testes) sempre executam em paralelo
- [ ] Opus sempre executa primeiro (cria arquitetura base)
- [ ] O agente detecta dependências automáticas e serializa quando necessário

**Benefício Esperado:**
- Sequencial (tudo em Opus): ~3 horas
- Paralelo (Opus → Sonnet ∥ Haiku): ~45 minutos

---

### EP-02 — Planejamento e Design

#### US-02.1 — Brainstorming de Features

> **Como** product owner do VSA Smart Assist,  
> **eu quero** sessions de brainstorming estruturadas para novas funcionalidades,  
> **para que** eu obtenha alternativas de design, trade-offs e recomendações antes de começar a implementar.

**Critérios de Aceitação:**
- [ ] A skill `brainstorming` é ativada automaticamente quando o prompt contém "planejar", "projetar" ou "como implementar"
- [ ] O agente gera pelo menos 3 abordagens alternativas
- [ ] Cada abordagem inclui prós, contras e nível de complexidade
- [ ] O agente recomenda uma abordagem com justificativa baseada na stack do VSA Smart Assist
- [ ] Output inclui sketch de arquitetura em texto/diagrama

**Exemplo de Trigger:**  
`"Como implementar histórico de tickets por usuário no dashboard?"`

---

#### US-02.2 — Criação de Planos de Implementação

> **Como** desenvolvedor,  
> **eu quero** um breakdown detalhado de tarefas antes de começar a codar,  
> **para que** eu tenha clareza sobre o escopo e possa acompanhar o progresso.

**Critérios de Aceitação:**
- [ ] A skill `writing-plans` gera um checklist de tarefas com ordem de execução
- [ ] Cada tarefa tem estimativa de complexidade (S/M/L)
- [ ] O plano referencia arquivos específicos do VSA Smart Assist que serão modificados
- [ ] O plano inclui tarefas de teste e validação
- [ ] Salvo como arquivo `.md` na pasta `docs/` ou `tasks/`

---

### EP-03 — Desenvolvimento Autônomo

#### US-03.1 — Execução de Tarefas por Subagente

> **Como** desenvolvedor,  
> **eu quero** que tarefas bem definidas sejam executadas autonomamente por subagentes,  
> **para que** eu possa focar em revisão e integração em vez de codificação manual repetitiva.

**Critérios de Aceitação:**
- [ ] A skill `subagent-driven-development` decompõe a tarefa em steps atômicos
- [ ] Cada step é executado por um subagente especializado
- [ ] O agente principal integra e valida os outputs
- [ ] Erros de execução são reportados com contexto suficiente para correção
- [ ] O desenvolvedor pode intervir em qualquer ponto do processo

**Scopo Aplicado ao VSA Smart Assist:**
- Geração automática de novos endpoints na `api.ts`
- Criação de novos componentes `shadcn/ui` customizados
- Adições à página de `Settings.tsx`

---

### EP-04 — Qualidade e Testes

#### US-04.1 — Ciclo TDD (Red-Green-Refactor)

> **Como** desenvolvedor,  
> **eu quero** seguir o ciclo RED-GREEN-REFACTOR para novas funcionalidades,  
> **para que** o código esteja sempre coberto por testes e a qualidade seja garantida desde o início.

**Critérios de Aceitação:**
- [ ] **RED:** O agente escreve o teste que falha antes de qualquer implementação
- [ ] **GREEN:** Implementa o código mínimo para o teste passar
- [ ] **REFACTOR:** Refatora mantendo todos os testes verdes
- [ ] Usa Vitest conforme configurado no projeto
- [ ] Testes são colocalizados ou em `src/test/`

**Exemplo de Aplicação:**
```
# RED
test("sendTestApiWebhook lança erro quando URL está vazia", ...)

# GREEN  
export async function sendTestApiWebhook() {
  if (!apiWebhookBase) throw new Error("URL não configurada");
  ...
}

# REFACTOR
// Extrair validação para função utilitária validateWebhookUrl()
```

---

#### US-04.2 — Debugging Sistemático

> **Como** desenvolvedor,  
> **eu quero** um processo estruturado para investigar bugs,  
> **para que** eu identifique a causa raiz em vez de apenas tratar sintomas.

**Critérios de Aceitação:**
- [ ] A skill `systematic-debugging` guia por: Observar → Hipótese → Testar → Corrigir
- [ ] O agente lista todos os arquivos potencialmente relacionados ao bug
- [ ] Sugere hipóteses ordenadas por probabilidade
- [ ] Propõe experimentos de isolamento antes de aplicar fixes
- [ ] Documenta a causa raiz e solução no commit message

**Exemplo no VSA Smart Assist:**  
`"Notificação do Telegram não está enviando a urgência do ticket corretamente"`
→ Investigação em `webhook.ts` → `notifyTelegram()` → formatação da mensagem

---

### EP-05 — Metaskills e Evolução do Sistema

#### US-05.1 — Criação de Novas Skills

> **Como** mantenedor do sistema de skills,  
> **eu quero** criar novas skills usando a meta-skill `writing-skills`,  
> **para que** o sistema evolua de forma consistente e bem documentada.

**Critérios de Aceitação:**
- [ ] A nova skill tem frontmatter YAML com `name` e `description`
- [ ] Inclui seção "Quando usar" com exemplos de triggers
- [ ] Inclui pelo menos um exemplo do mundo real
- [ ] O `SKILL.md` é revisado com a `writing-skills` antes de merge
- [ ] A skill é adicionada ao catálogo neste documento

---

## Skills Catalog

### `smart-dispatch`

| Campo | Valor |
|-------|-------|
| **Propósito** | Roteamento de tarefas para modelos Opus/Sonnet/Haiku com execução paralela |
| **Trigger** | "Implementar X", "Adicionar X", "Integrar X", "Criar X complexo" |
| **Caminho** | `skills/smart-dispatch/SKILL.md` |
| **Modelos** | Opus (arquitetura) → Sonnet (implementação) ∥ Haiku (boilerplate) |

**Regras de Roteamento:**

| Modelo | Quando Usar | Exemplo no VSA Smart Assist |
|--------|-------------|---------------------------|
| **Opus** | Arquitetura, design, decisões complexas | Projetar sistema de relatórios de chamados |
| **Sonnet** | Componentes, hooks, integrações API | Implementar `ReportsPage.tsx`, `useTicketMetrics.ts` |
| **Haiku** | Estilos, i18n, testes, boilerplate | `.styles.ts`, arquivos de tradução, mocks |

**Exemplos que ativam a skill:**
- ✅ `"Implementar página de relatórios com métricas de chamados"`
- ✅ `"Adicionar autenticação de dois fatores"`
- ✅ `"Refatorar Dashboard para suportar paginação"`
- ❌ `"Ler este arquivo"` — muito simples
- ❌ `"Corrigir typo na linha 42"` — não requer dispatch

---

### `brainstorming`

| Campo | Valor |
|-------|-------|
| **Propósito** | Refinamento de design e exploração de alternativas antes da implementação |
| **Trigger** | "Como implementar", "Planejar feature", "Projetar X", "Qual a melhor forma de" |
| **Caminho** | `skills/brainstorming/SKILL.md` |
| **Output** | Documento com 3+ alternativas, trade-offs, e recomendação fundamentada |

**Aplicação no VSA Smart Assist:**
- Comparar abordagens para persistência de tickets (localStorage vs. Supabase vs. n8n)
- Design de interface para bulk actions no Dashboard
- Estratégia de notificações push vs. Telegram

---

### `writing-plans`

| Campo | Valor |
|-------|-------|
| **Propósito** | Criar breakdowns de implementação com ordem de execução e estimativas |
| **Trigger** | Antes de iniciar qualquer feature M/L de complexidade |
| **Caminho** | `skills/writing-plans/SKILL.md` |
| **Output** | Checklist em `.md` com tarefas, arquivos afetados e critérios de conclusão |

**Template de Plano:**
```markdown
## Plano: [Nome da Feature]

### Arquivos Afetados
- `src/pages/X.tsx` — Criar/Modificar
- `src/lib/api.ts` — Adicionar função Y

### Tasks
- [ ] [S] Criar interface TypeScript para o novo modelo
- [ ] [M] Implementar lógica de negócio em api.ts
- [ ] [M] Criar componente de UI em pages/
- [ ] [S] Adicionar rota em App.tsx
- [ ] [S] Escrever testes unitários

### Critérios de Conclusão (DoD)
- [ ] Todos os testes passam (`npm test`)
- [ ] Sem erros de lint (`npm run lint`)
- [ ] Comportamento validado no browser
```

---

### `subagent-driven-development`

| Campo | Valor |
|-------|-------|
| **Propósito** | Execução autônoma de tarefas complexas via subagentes especializados |
| **Trigger** | Tarefas com `writing-plans` gerado e aprovado |
| **Caminho** | `skills/subagent-driven-development/SKILL.md` |
| **Output** | Código implementado, testado e pronto para revisão |

**Fluxo:**
```
Plano aprovado
    ↓
Agente principal decompõe em steps atômicos
    ↓
Subagentes executam cada step de forma independente
    ↓
Agente principal integra outputs
    ↓
Desenvolvedor revisa e faz merge
```

---

### `test-driven-development`

| Campo | Valor |
|-------|-------|
| **Propósito** | Garantir cobertura de testes via ciclo RED-GREEN-REFACTOR |
| **Trigger** | "Criar testes para X", "Implementar X com TDD" |
| **Caminho** | `skills/test-driven-development/SKILL.md` |
| **Framework** | Vitest 3.2 + React Testing Library (conforme CLAUDE.md) |

**Ciclo:**
1. 🔴 **RED** — Escreve teste que falha (define comportamento esperado)
2. 🟢 **GREEN** — Código mínimo para o teste passar
3. 🔵 **REFACTOR** — Melhora qualidade sem quebrar testes

---

### `systematic-debugging`

| Campo | Valor |
|-------|-------|
| **Propósito** | Análise estruturada de causa raiz para bugs e comportamentos inesperados |
| **Trigger** | "Bug em X", "X não está funcionando", "Por que X?" |
| **Caminho** | `skills/systematic-debugging/SKILL.md` |
| **Output** | Root cause identificado + fix implementado + documentação no commit |

**Metodologia:**
1. **Observar** — Reproduzir o bug de forma confiável
2. **Isolar** — Identificar o menor código que demonstra o problema
3. **Hipóteses** — Listar causas possíveis ordenadas por probabilidade
4. **Testar** — Validar/refutar cada hipótese sistematicamente
5. **Corrigir** — Implementar fix na causa raiz
6. **Verificar** — Confirmar que o bug está resolvido e nenhuma regressão foi introduzida

---

### `writing-skills`

| Campo | Valor |
|-------|-------|
| **Propósito** | Meta-skill para criar, iterar e melhorar outras skills |
| **Trigger** | "Criar nova skill para X", "Melhorar skill Y" |
| **Caminho** | `skills/writing-skills/SKILL.md` |
| **Output** | Novo `SKILL.md` ou atualização de skill existente |

**Template de SKILL.md:**
```markdown
---
name: nome-da-skill
description: Descrição concisa do propósito. Quando usar.
---

# [Nome da Skill]

## Quando Usar
[Triggers e condições de ativação]

## Como Funciona
[Passo a passo do processo]

## Exemplo do Mundo Real
[Aplicação concreta no VSA Smart Assist]
```

---

## Como Usar as Skills no VSA Smart Assist

### Passo 1 — Identificar a Skill Adequada

```
Preciso planejar uma feature nova?  → brainstorming + writing-plans
Preciso implementar algo complexo?  → smart-dispatch
Tenho um bug para investigar?       → systematic-debugging
Preciso escrever código com testes? → test-driven-development
Quero criar uma nova skill?         → writing-skills
```

### Passo 2 — Ativar a Skill

Mencione explicitamente a skill no prompt, ou use uma frase que a trigger automaticamente:

```bash
# Explícito
"Use smart-dispatch para implementar a página de relatórios"

# Implícito (trigger automático)
"Implementar página de relatórios com gráficos de chamados por dia"
```

### Passo 3 — Revisar o Plano

O agente sempre exibe o plano antes de executar. Revise:
- Os modelos designados são adequados?
- A ordem de execução faz sentido?
- Há dependências não mapeadas?

### Passo 4 — Aprovar e Executar

Após aprovação, o agente:
1. Executa tasks em paralelo onde possível
2. Integra os outputs
3. Apresenta código para revisão

### Passo 5 — Revisar e Integrar

Você revisa o código gerado, roda os testes (`npm test`) e faz o merge.

---

## Fluxo de Roteamento de Modelos

```
Você descreve a tarefa
        │
        ▼
┌───────────────────────┐
│  Análise de           │
│  Complexidade         │  ← Lê CLAUDE.md para contexto
└──────────┬────────────┘
           │
     ┌─────┴──────┐
     │            │
  Simples?     Complexo?
     │            │
     ▼            ▼
  Direto      ┌──────────────────┐
  (sem        │   OPUS           │  ← Arquitetura & plano
  dispatch)   │   Runs First     │
              └────────┬─────────┘
                       │ Plano pronto
              ┌────────┼─────────┐
              │        │         │
           ┌──▼──┐  ┌──▼──┐   (mais Sonnet...)
           │Sonnet│  │Sonnet│  ← Em paralelo
           │  A  │  │  B  │     (independentes)
           └──┬──┘  └──┬──┘
              └────┬────┘
                   │ Implementações prontas
         ┌─────────┼──────────┐
         │         │          │
      ┌──▼──┐   ┌──▼──┐   ┌──▼──┐
      │Haiku│   │Haiku│   │Haiku│  ← Em paralelo
      │ A   │   │ B   │   │ C   │    (estilos, i18n, testes)
      └──┬──┘   └──┬──┘   └──┬──┘
         └─────────┴──────────┘
                   │
                   ▼
          Você integra & revisa
```

### Custo e Tempo Estimado

| Estratégia | Custo Relativo | Tempo Estimado |
|------------|---------------|----------------|
| Tudo em Opus | 100% | ~3 horas |
| Smart Dispatch (Opus → Sonnet ∥ Haiku) | ~60% | ~45 minutos |
| Somente Haiku | ~15% | ~30 min (qualidade baixa) |

> **Recomendação:** Use `smart-dispatch` para qualquer tarefa que leve mais de 15 minutos e envolva decisões de arquitetura.

---

## Referências

- [`skills/smart-dispatch/SKILL.md`](../skills/smart-dispatch/SKILL.md) — Skill principal de roteamento
- [`CLAUDE.md`](../CLAUDE.md) — Arquitetura e padrões do VSA Smart Assist
- [`README.md`](../README.md) — Visão geral do projeto

---

*Documento criado em 2026-04-01. Mantido pela equipe de desenvolvimento VSA Tecnologia.*
