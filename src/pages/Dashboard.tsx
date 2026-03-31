import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, RefreshCw, AlertTriangle, AlertCircle, CheckCircle2, TicketIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchDashboard, type DashboardTicket } from "@/lib/api";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG = {
  ALTA: { color: "bg-destructive text-destructive-foreground", icon: AlertTriangle },
  MÉDIA: { color: "bg-warning text-warning-foreground", icon: AlertCircle },
  BAIXA: { color: "bg-success text-success-foreground", icon: CheckCircle2 },
} as const;

// Mock data for demo
const MOCK_DATA: DashboardTicket[] = [
  { id: "23638", nome: "Maria Silva", setor: "TI", tipo: "Hardware", prioridade: "ALTA", responsavel: "Carlos", status: "Novo", data: "2025-03-31" },
  { id: "23637", nome: "João Santos", setor: "RH", tipo: "Sistema", prioridade: "MÉDIA", responsavel: "Ana", status: "Processando", data: "2025-03-31" },
  { id: "23636", nome: "Pedro Costa", setor: "Financeiro", tipo: "Rede", prioridade: "BAIXA", responsavel: "Lucas", status: "Resolvido", data: "2025-03-30" },
  { id: "23635", nome: "Ana Oliveira", setor: "Enfermagem", tipo: "Acesso", prioridade: "ALTA", responsavel: "Carlos", status: "Novo", data: "2025-03-30" },
  { id: "23634", nome: "Lucas Lima", setor: "Administrativo", tipo: "Sistema", prioridade: "MÉDIA", responsavel: "Ana", status: "Processando", data: "2025-03-29" },
  { id: "23633", nome: "Fernanda Souza", setor: "TI", tipo: "Hardware", prioridade: "BAIXA", responsavel: "Lucas", status: "Resolvido", data: "2025-03-29" },
];

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: tickets = MOCK_DATA, refetch, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 30000,
    retry: false,
    placeholderData: MOCK_DATA,
  });

  const stats = useMemo(() => ({
    total: tickets.length,
    alta: tickets.filter(t => t.prioridade === "ALTA").length,
    media: tickets.filter(t => t.prioridade === "MÉDIA").length,
    baixa: tickets.filter(t => t.prioridade === "BAIXA").length,
  }), [tickets]);

  const filtered = useMemo(() => {
    let result = tickets;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.nome.toLowerCase().includes(q) || t.id.includes(q));
    }
    if (priorityFilter !== "all") {
      result = result.filter(t => t.prioridade === priorityFilter);
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
    { label: "Baixos", value: stats.baixa, icon: CheckCircle2, accent: "text-success" },
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
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="ALTA">Alta</SelectItem>
              <SelectItem value="MÉDIA">Média</SelectItem>
              <SelectItem value="BAIXA">Baixa</SelectItem>
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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Setor</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Prioridade</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Responsável</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Data</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ticket => {
                  const prio = PRIORITY_CONFIG[ticket.prioridade];
                  return (
                    <tr key={ticket.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-primary">#{ticket.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{ticket.nome}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{ticket.setor}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{ticket.tipo}</td>
                      <td className="px-4 py-3">
                        <Badge className={prio.color}>{ticket.prioridade}</Badge>
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
    </Layout>
  );
};

export default Dashboard;
