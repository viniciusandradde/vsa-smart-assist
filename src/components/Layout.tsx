import { Link, useLocation, useNavigate } from "react-router-dom";
import { TicketPlus, LayoutDashboard, Settings as SettingsIcon, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const navItems = [
    { to: "/", label: "Novo Chamado", icon: TicketPlus },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/settings", label: "Configurações", icon: SettingsIcon },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      toast.success("Sessão encerrada.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Erro ao sair. Tente novamente.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VS</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-foreground">VSA Smart Help</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Triagem Inteligente</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}

            {/* Divider + Logout */}
            <div className="ml-2 pl-2 border-l border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                disabled={signingOut}
                className="text-muted-foreground hover:text-foreground"
              >
                {signingOut
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <LogOut className="w-4 h-4" />
                }
                <span className="hidden sm:inline ml-1.5">Sair</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} VSA Tecnologia — Smart Help v1.0
        </p>
      </footer>
    </div>
  );
};

export default Layout;
