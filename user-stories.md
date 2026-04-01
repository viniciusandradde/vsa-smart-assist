# VSA Smart Dispatch — User Stories (XP Style)
> Projeto: vsa-smart-assist | App: vsa-ticket-flow.lovable.app
> Live: 01/04/2025 — Vinicius Andrade · VSA Tecnologia

---

## 📌 Épico 1 — Abertura de Chamado

### US-01 · Abertura de chamado pelo usuário
```
Como usuário final (colaborador ou cliente),
Quero abrir um chamado descrevendo meu problema,
Para que a equipe de TI da VSA seja notificada e possa me ajudar.
```
**Critérios de Aceite:**
- [ ] Formulário exige: título, descrição, nome, e-mail ou ramal
- [ ] Chamado recebe um ID único após envio (ex: VSA-2025-0042)
- [ ] Confirmação visual de envio exibida ao usuário
- [ ] Webhook disparado para o n8n em até 2 segundos

**Story Points:** 3  
**Prioridade:** MUST HAVE

---

### US-02 · Abertura com anexo de evidência
```
Como usuário final,
Quero anexar uma imagem ou print ao chamado,
Para que o técnico entenda melhor o problema sem precisar perguntar.
```
**Critérios de Aceite:**
- [ ] Aceita formatos: PNG, JPG, PDF (max 5MB)
- [ ] Anexo é armazenado e referenciado no chamado
- [ ] Campo é opcional — não bloqueia envio

**Story Points:** 2  
**Prioridade:** SHOULD HAVE

---

## 📌 Épico 2 — Triagem Inteligente com IA (Smart Dispatch)

### US-03 · Classificação automática de urgência
```
Como gestor de TI,
Quero que a IA classifique automaticamente a urgência do chamado,
Para priorizar o atendimento sem revisão manual de cada ticket.
```
**Critérios de Aceite:**
- [ ] IA retorna uma das 3 classificações: CRÍTICO | ALTO | NORMAL
- [ ] Classificação baseada no texto da descrição (palavras-chave + contexto)
- [ ] Resposta do Claude em JSON `{ "urgencia": "CRÍTICO", "motivo": "..." }`
- [ ] Chamados CRÍTICOS recebem flag visual no dashboard
- [ ] Latência da classificação < 5 segundos

**Story Points:** 5  
**Prioridade:** MUST HAVE

---

### US-04 · Sugestão automática de responsável
```
Como gestor de TI,
Quero que o sistema sugira qual técnico deve atender o chamado,
Para reduzir o tempo de triagem e garantir que a pessoa certa seja acionada.
```
**Critérios de Aceite:**
- [ ] IA retorna o perfil ideal do responsável com base na categoria
- [ ] Categorias mapeadas: Infraestrutura | Segurança | Sistemas | LGPD | Redes
- [ ] Sugestão pode ser aceita ou alterada manualmente pelo gestor
- [ ] Histórico de atribuições visível no chamado

**Story Points:** 5  
**Prioridade:** MUST HAVE

---

### US-05 · Resposta inicial automática ao usuário
```
Como usuário final,
Quero receber uma resposta inicial automática após abrir o chamado,
Para saber que fui atendido e qual o prazo estimado de solução.
```
**Critérios de Aceite:**
- [ ] E-mail ou mensagem enviada em até 30 segundos após abertura
- [ ] Mensagem inclui: ID do chamado, urgência classificada, prazo estimado
- [ ] Prazo baseado em urgência: CRÍTICO=2h | ALTO=4h | NORMAL=24h
- [ ] Tom da mensagem: profissional e empático

**Story Points:** 3  
**Prioridade:** SHOULD HAVE

---

## 📌 Épico 3 — Gestão e Acompanhamento

### US-06 · Dashboard de chamados em tempo real
```
Como gestor de TI,
Quero visualizar todos os chamados abertos em um dashboard,
Para ter visibilidade do volume, urgência e status de cada ticket.
```
**Critérios de Aceite:**
- [ ] Cards exibem: ID, título, urgência, responsável, status, tempo aberto
- [ ] Filtros por: urgência, responsável, status, período
- [ ] Atualização automática a cada 30 segundos (ou via WebSocket)
- [ ] Indicadores: total aberto, CRÍTICOS, tempo médio de resolução

**Story Points:** 5  
**Prioridade:** MUST HAVE

---

### US-07 · Atualização de status pelo técnico
```
Como técnico de TI,
Quero atualizar o status do chamado enquanto trabalho nele,
Para que o gestor e o usuário acompanhem o progresso em tempo real.
```
**Critérios de Aceite:**
- [ ] Status possíveis: ABERTO → EM ATENDIMENTO → AGUARDANDO USUÁRIO → RESOLVIDO → FECHADO
- [ ] Transição de status registra timestamp e responsável
- [ ] Usuário notificado a cada mudança de status
- [ ] SLA pausado quando status = AGUARDANDO USUÁRIO

**Story Points:** 3  
**Prioridade:** MUST HAVE

---

## 📌 Épico 4 — Economia de Tokens (XP: Simplicidade)

### US-08 · Prompt otimizado para classificação
```
Como desenvolvedor do sistema,
Quero que o prompt enviado ao Claude seja o menor possível,
Para reduzir custo por chamado sem perder qualidade da classificação.
```
**Critérios de Aceite:**
- [ ] Prompt fixo no n8n: system prompt < 200 tokens
- [ ] Contexto enviado: somente título + descrição (sem histórico completo)
- [ ] Resposta forçada em JSON (sem texto livre)
- [ ] Custo estimado por classificação < R$ 0,002
- [ ] Sem chamadas duplicadas ao mesmo chamado

**Story Points:** 3  
**Prioridade:** MUST HAVE (tema da live)

---

## 📋 Backlog Priorizado (MoSCoW)

| ID | User Story | Prioridade | Points |
|----|-----------|-----------|--------|
| US-01 | Abertura de chamado | MUST | 3 |
| US-03 | Classificação de urgência com IA | MUST | 5 |
| US-04 | Sugestão de responsável | MUST | 5 |
| US-06 | Dashboard em tempo real | MUST | 5 |
| US-07 | Atualização de status | MUST | 3 |
| US-08 | Prompt otimizado | MUST | 3 |
| US-05 | Resposta automática ao usuário | SHOULD | 3 |
| US-02 | Abertura com anexo | SHOULD | 2 |

**Total Sprint 1:** US-01 + US-03 + US-08 = **11 points** (demo da live)

---

## 🔄 Iterações XP Sugeridas

| Iteração | Duração | Foco | Entrega |
|---------|---------|------|---------|
| Sprint 1 | 1 semana | Abertura + IA classifica | Chamado aberto e classificado automaticamente |
| Sprint 2 | 1 semana | Atribuição + dashboard | Gestor vê todos chamados com responsável |
| Sprint 3 | 1 semana | Notificações + SLA | Usuário recebe updates automáticos |
| Sprint 4 | 1 semana | Deploy + otimização | Sistema em produção com custo controlado |
