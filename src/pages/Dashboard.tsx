import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, RefreshCw, AlertTriangle, AlertCircle, CheckCircle2, TicketIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchDashboard, updateTicketStatus, addTicketResponse, type DashboardTicket } from "@/lib/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG = {
  CRÍTICO: { color: "bg-destructive text-destructive-foreground", icon: AlertTriangle },
  ALTO: { color: "bg-warning text-warning-foreground", icon: AlertCircle },
  NORMAL: { color: "bg-success text-success-foreground", icon: CheckCircle2 },
} as const;

// Removing mock data in favor of live integration
const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTicket, setSelectedTicket] = useState<DashboardTicket | null>(null);
  const [responseText, setResponseText] = useState("");
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateTicketStatus(id, status),
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(["dashboard"], (old: DashboardTicket[] = []) => 
        old.map(t => t.id === updatedTicket.id ? updatedTicket : t)
      );
      if (selectedTicket?.id === updatedTicket.id) setSelectedTicket(updatedTicket);
      toast.success("Status atualizado com sucesso!");
    },
    onError: () => toast.error("Falha ao atualizar o status.")
  });

  const responseMutation = useMutation({
    mutationFn: ({ id, text }: { id: string, text: string }) => addTicketResponse(id, text),
    onSuccess: (updatedTicket) => {
      queryClient.setQueryData(["dashboard"], (old: DashboardTicket[] = []) => 
        old.map(t => t.id === updatedTicket.id ? updatedTicket : t)
      );
      if (selectedTicket?.id === updatedTicket.id) setSelectedTicket(updatedTicket);
      setResponseText("");
      toast.success("Resposta enviada com sucesso!");
    },
    onError: () => toast.error("Falha ao enviar resposta.")
  });

  const { data: tickets = [], refetch, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 30000,
    retry: false,
  });

  const stats = useMemo(() => ({
    total: tickets.length,
    alta: tickets.filter(t => t.urgencia === "CRÍTICO").length,
    media: tickets.filter(t => t.urgencia === "ALTO").length,
    baixa: tickets.filter(t => t.urgencia === "NORMAL").length,
  }), [tickets]);

  const filtered = useMemo(() => {
    let result = tickets;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.nome.toLowerCase().includes(q) || t.id.includes(q) || t.titulo.toLowerCase().includes(q));
    }
    if (priorityFilter !== "all") {
      result = result.filter(t => t.urgencia === priorityFilter);
    }
    return result.sort((a, b) => sortOrder === "desc"
      ? b.data.localeCompare(a.data)
      : a.data.localeCompare(b.data)
    );
  }, [tickets, search, priorityFilter, sortOrder]);

  const statCards = [
    { label: "Total", value: stats.total, icon: TicketIcon, accent: "text-info" },
    { label: "Críticos", value: stats.alta, icon: AlertTriangle, accent: "text-destructive" },
    { label: "Médios", value: stats.media, icon: AlertCircle, accent: "text-warning" },
    { label: "Normal", value: stats.baixa, icon: CheckCircle2, accent: "text-success" },
  ];

  return (
    <Layout>
      <div className="container py-8 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isFetching && "animate-spin")} />
            Atualizar
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                <Icon className={cn("w-4 h-4", accent)} />
              </div>
              <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Urgência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="CRÍTICO">Crítico</SelectItem>
              <SelectItem value="ALTO">Alto</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setSortOrder(o => o === "desc" ? "asc" : "desc")} className="shrink-0">
            Data {sortOrder === "desc" ? "↓" : "↑"}
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Título</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Setor</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Urgência</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Responsável</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Data</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ticket => {
                  const prio = PRIORITY_CONFIG[ticket.urgencia];
                  return (
                    <tr 
                      key={ticket.id} 
                      onClick={() => setSelectedTicket(ticket)}
                      className="border-b border-border/50 hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-primary">#{ticket.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{ticket.titulo}</td>
                      <td className="px-4 py-3 text-muted-foreground">{ticket.nome}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{ticket.setor}</td>
                      <td className="px-4 py-3">
                        <Badge className={prio.color}>{ticket.urgencia}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{ticket.responsavel}</td>
                      <td className="px-4 py-3 text-secondary-foreground">{ticket.status}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{ticket.data}</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      Nenhum chamado encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Sheet open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto w-full">
          {selectedTicket && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-bold flex items-center justify-between">
                  {selectedTicket.id}
                  <Badge className={PRIORITY_CONFIG[selectedTicket.urgencia]?.color}>
                    {selectedTicket.urgencia}
                  </Badge>
                </SheetTitle>
                <SheetDescription className="text-base text-foreground font-medium">
                  {selectedTicket.titulo}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                {/* AI Analysis Block */}
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-3">
                  <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Análise da IA
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground block text-xs">Categoria</span>
                      <span className="font-medium">{selectedTicket.tipo}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Time Designado</span>
                      <span className="font-medium">{selectedTicket.responsavel}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block text-xs">Motivo da Decisão</span>
                      <p className="italic text-foreground/80 mt-1">{selectedTicket.motivo || "Não informado pela IA."}</p>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs">Solicitante</span>
                    <span className="font-medium">{selectedTicket.nome}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Setor</span>
                    <span className="font-medium">{selectedTicket.setor}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Data de Abertura</span>
                    <span className="font-medium">{selectedTicket.data}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Descrição Original</span>
                  <div className="bg-accent/50 p-3 rounded-md text-sm whitespace-pre-wrap">
                    {selectedTicket.descricao || "Sem descrição adicional."}
                  </div>
                </div>

                {/* Interações e Respostas */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold mb-3 text-secondary-foreground">Respostas e Interações</h3>
                  
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedTicket.respostas && selectedTicket.respostas.length > 0 ? (
                      selectedTicket.respostas.map((resp, i) => (
                        <div key={i} className="bg-accent/30 rounded-lg p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-primary text-xs">{resp.autor}</span>
                            <span className="text-muted-foreground text-[10px]">
                              {new Date(resp.data).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{resp.texto}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic text-center py-2">
                        Nenhuma interação registrada até o momento.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Textarea 
                      placeholder="Digite uma resposta ou anotação para o usuário..." 
                      className="min-h-[80px] resize-none"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => responseMutation.mutate({ id: selectedTicket.id, text: responseText })}
                      disabled={!responseText.trim() || responseMutation.isPending}
                    >
                      {responseMutation.isPending ? "Enviando..." : "Adicionar Resposta"}
                    </Button>
                  </div>
                </div>

                {/* Tracking & Actions */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold mb-3">Módulo de Atendimento</h3>
                  <div className="flex flex-col gap-3">
                    <Select 
                      value={selectedTicket.status} 
                      onValueChange={(val) => statusMutation.mutate({ id: selectedTicket.id, status: val })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status do Chamado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aberto">Aberto</SelectItem>
                        <SelectItem value="Em Atendimento">Em Atendimento</SelectItem>
                        <SelectItem value="Resolvido">Resolvido</SelectItem>
                        <SelectItem value="Fechado">Fechado</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" className="w-full" onClick={() => setSelectedTicket(null)}>
                      Fechar Painel
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default Dashboard;
