const WEBHOOK_BASE = "https://SEU-N8N/webhook";

export interface TicketPayload {
  nome: string;
  email: string;
  setor: string;
  tipo: string;
  descricao: string;
  data_abertura: string;
}

export interface DashboardTicket {
  id: string;
  nome: string;
  setor: string;
  tipo: string;
  prioridade: "ALTA" | "MÉDIA" | "BAIXA";
  responsavel: string;
  status: string;
  data: string;
}

export async function submitTicket(payload: TicketPayload) {
  const res = await fetch(`${WEBHOOK_BASE}/vsa-smart-help`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao enviar chamado");
  return res.json();
}

export async function fetchDashboard(): Promise<DashboardTicket[]> {
  const res = await fetch(`${WEBHOOK_BASE}/vsa-smart-help-dashboard`);
  if (!res.ok) throw new Error("Erro ao buscar dados");
  return res.json();
}
