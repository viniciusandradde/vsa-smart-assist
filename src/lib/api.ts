const LOCAL_STORAGE_KEY = "vsa_tickets";
import { notifyTelegram, getWebhookSettings } from "./webhook";

export interface TicketPayload {
  id?: string;
  titulo: string;
  nome: string;
  email: string;
  setor?: string;
  tipo?: string;
  descricao: string;
  data_abertura: string;
}

export interface TicketResponse {
  autor: string;
  texto: string;
  data: string;
}

export interface DashboardTicket {
  id: string;
  titulo: string;
  nome: string;
  setor: string;
  tipo: string;
  urgencia: "CRÍTICO" | "ALTO" | "NORMAL";
  responsavel: string;
  status: string;
  data: string;
  descricao?: string;
  motivo?: string;
  respostas?: TicketResponse[];
}

export async function submitTicket(payload: TicketPayload) {
  const { apiWebhookBase } = getWebhookSettings();
  const res = await fetch(`${apiWebhookBase}/vsa-smart-help`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao enviar chamado");
  
  const data = await res.json();
  
  // Persistir no localStorage do navegador para exibição no Dashboard
  const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
  const tickets: DashboardTicket[] = existing ? JSON.parse(existing) : [];
  
  const newTicket: DashboardTicket = {
    id: data.id || payload.id || `VSA-${Date.now()}`,
    titulo: data.titulo || payload.titulo,
    nome: data.nome || payload.nome,
    setor: payload.setor || "Geral",
    tipo: data.classificacao?.categoria || "Indefinido",
    urgencia: data.classificacao?.urgencia || "NORMAL",
    responsavel: data.classificacao?.responsavel || "Atendimento VSA",
    status: data.status || "Aberto",
    data: new Date().toISOString().split("T")[0],
    descricao: payload.descricao,
    motivo: data.classificacao?.motivo,
    respostas: [],
  };
  
  tickets.unshift(newTicket);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
  
  // Enviar notificação para o Telegram
  await notifyTelegram(newTicket, "NEW");
  
  return data;
}

export async function fetchDashboard(): Promise<DashboardTicket[]> {
  // Ler do localStorage em vez de fazer fetch num webhook de dashboard fixo
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      resolve(existing ? JSON.parse(existing) : []);
    }, 400); // delay artificial suave
  });
}

export async function updateTicketStatus(id: string, novoStatus: string): Promise<DashboardTicket> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!existing) return reject(new Error("Nenhum chamado encontrado"));
      
      const tickets: DashboardTicket[] = JSON.parse(existing);
      const index = tickets.findIndex(t => t.id === id);
      
      if (index === -1) return reject(new Error("Chamado não encontrado"));
      
      tickets[index].status = novoStatus;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
      
      const updatedTicket = tickets[index];

      // Enviar notificação para o Telegram se for para EM ATENDIMENTO ou RESOLVIDO/FECHADO
      if (novoStatus === "Em Atendimento") {
        notifyTelegram(updatedTicket, "IN_PROGRESS");
      } else if (novoStatus === "Resolvido" || novoStatus === "Fechado") {
        notifyTelegram(updatedTicket, "RESOLVED");
      }

      resolve(updatedTicket);
    }, 300);
  });
}

export async function addTicketResponse(id: string, texto: string, autor = "Suporte Local"): Promise<DashboardTicket> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!existing) return reject(new Error("Nenhum chamado encontrado"));
      
      const tickets: DashboardTicket[] = JSON.parse(existing);
      const index = tickets.findIndex(t => t.id === id);
      
      if (index === -1) return reject(new Error("Chamado não encontrado"));
      
      if (!tickets[index].respostas) {
        tickets[index].respostas = [];
      }
      
      tickets[index].respostas.push({
        autor,
        texto,
        data: new Date().toISOString()
      });
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
      resolve(tickets[index]);
    }, 300);
  });
}

export async function sendTestApiWebhook() {
  const { apiWebhookBase } = getWebhookSettings();
  const testPayload = {
    id: `TEST-${Date.now()}`,
    titulo: "Chamado de Teste (Conexão)",
    nome: "Teste de Sistema",
    email: "teste@vsa.com.br",
    setor: "TI",
    descricao: "Este é um chamado de teste enviado para verificar a conexão do webhook.",
    data_abertura: new Date().toISOString()
  };

  const res = await fetch(`${apiWebhookBase}/vsa-smart-help`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testPayload),
  });

  if (!res.ok) {
    throw new Error(`Erro na conexão HTTP: ${res.status}`);
  }

  return res.json();
}
