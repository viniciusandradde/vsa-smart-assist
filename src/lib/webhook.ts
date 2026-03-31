import { DashboardTicket } from "./api";

const BOT_TOKEN = "8626578306:AAGWYcukPEJS2HwMggAYmw7sUAf5P2RbYDo";

export interface WebhookSettings {
  telegramEnabled: boolean;
  telegramChatId: string;
}

export function getWebhookSettings(): WebhookSettings {
  if (typeof window === "undefined") return { telegramEnabled: false, telegramChatId: "" };
  const str = localStorage.getItem("vsa_webhook_settings");
  if (str) return JSON.parse(str);
  return { telegramEnabled: false, telegramChatId: "" };
}

export function saveWebhookSettings(settings: WebhookSettings) {
  localStorage.setItem("vsa_webhook_settings", JSON.stringify(settings));
}

export async function notifyTelegram(ticket: DashboardTicket, type: "NEW" | "IN_PROGRESS" | "RESOLVED") {
  const config = getWebhookSettings();
  if (!config.telegramEnabled || !config.telegramChatId) return;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  let icon = "🚨";
  let title = "NOVO CHAMADO";
  if (type === "IN_PROGRESS") { icon = "⏳"; title = "EM ATENDIMENTO"; }
  else if (type === "RESOLVED") { icon = "✅"; title = "CHAMADO FINALIZADO"; }

  const msg = `${icon} *${title}* [#${ticket.id}]\n\n` +
    `*Título:* ${ticket.titulo}\n` +
    `*Solicitante:* ${ticket.nome} (${ticket.setor})\n` +
    `*Urgência:* ${ticket.urgencia}\n` +
    `*Responsável:* ${ticket.responsavel}\n` +
    (type === "NEW" ? `\n*Descriçāo:* ${ticket.descricao?.substring(0,100)}...` : "");

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text: msg,
        parse_mode: "Markdown",
      }),
    });
  } catch (error) {
    console.error("Erro ao enviar notificação Telegram:", error);
  }
}
