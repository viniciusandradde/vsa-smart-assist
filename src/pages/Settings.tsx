import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Webhook, Send, Activity } from "lucide-react";
import { getWebhookSettings, saveWebhookSettings, type WebhookSettings, sendTestTelegram } from "@/lib/webhook";
import { sendTestApiWebhook } from "@/lib/api";
import { cn } from "@/lib/utils";

const Settings = () => {
  const [settings, setSettings] = useState<WebhookSettings>({
    telegramEnabled: false,
    telegramChatId: "",
    apiWebhookBase: "",
  });
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);

  useEffect(() => {
    setSettings(getWebhookSettings());
  }, []);

  const handleSave = () => {
    saveWebhookSettings(settings);
    toast.success("Configurações salvas com sucesso!");
  };

  const handleTestTelegram = async () => {
    if (!settings.telegramChatId) {
      toast.error("Por favor, preencha o Chat ID antes de testar.");
      return;
    }

    setIsTestingTelegram(true);
    try {
      saveWebhookSettings(settings);
      await sendTestTelegram();
      toast.success("Mensagem de teste enviada com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Falha ao enviar mensagem de teste.");
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleTestApi = async () => {
    if (!settings.apiWebhookBase) {
      toast.error("Por favor, preencha a URL do Webhook antes de testar.");
      return;
    }

    setIsTestingApi(true);
    try {
      saveWebhookSettings(settings);
      await sendTestApiWebhook();
      toast.success("Webhook disparado com sucesso! Verifique seu n8n.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Falha ao disparar webhook de teste.");
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 px-4 max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
            <Webhook className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Configurações de Integração</h2>
            <p className="text-sm text-muted-foreground">
              Configure webhooks e integrações externas.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-8">
          {/* API Webhook Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border pb-2">Sistema (n8n API)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">URL Base do Webhook</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input 
                    placeholder="https://sua-instancia-n8n.com/webhook-test"
                    value={settings.apiWebhookBase}
                    onChange={(e) => setSettings({ ...settings, apiWebhookBase: e.target.value })}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleTestApi}
                    disabled={isTestingApi}
                    className="shrink-0"
                  >
                    <Activity className={cn("w-4 h-4 mr-2", isTestingApi && "animate-spin")} />
                    {isTestingApi ? "Testando..." : "Testar Webhook"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Esta é a URL base usada para processar a triagem de novos chamados. 
                  <br />Padrao: <code>https://n8n.vsatecnologia.com.br/webhook-test</code>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border pb-2">Telegram</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-sm font-medium text-foreground block">
                  Ativar Notificações no Telegram
                </strong>
                <span className="text-xs text-muted-foreground">
                  Receba alertas em tempo real sobre novos chamados e atualizações de status.
                </span>
              </div>
              <Switch 
                checked={settings.telegramEnabled}
                onCheckedChange={(v) => setSettings({ ...settings, telegramEnabled: v })}
              />
            </div>

            {settings.telegramEnabled && (
              <div className="pt-2">
                <label className="text-sm font-medium text-foreground mb-1 block">Chat ID do Telegram</label>
                <Input 
                  placeholder="EX: 123456789"
                  value={settings.telegramChatId}
                  onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Para descobrir seu Chat ID, envie uma mensagem para o bot <strong>@RawDataBot</strong> no Telegram. O bot que enviará as mensagens é o <strong>VSA Smart Help</strong>.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end">
            <Button 
              variant="secondary" 
              onClick={handleTestTelegram} 
              disabled={isTestingTelegram || !settings.telegramEnabled}
              className="w-full sm:w-auto"
            >
              <Send className="w-4 h-4 mr-2" />
              {isTestingTelegram ? "Testando..." : "Testar Telegram"}
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
