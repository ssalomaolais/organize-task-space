import { useState, useEffect } from "react";
import { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/CalendarView.css";
import { User as UserIcon, Settings, Key, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import UsersPage from "@/components/users/UsersPage";
import EventTypesPageModal from "@/components/event_types/EventTypesPageModal";
import StacksPageModal from "@/components/stacks/StacksPageModal";
import DisciplinesPageModal from "@/components/disciplines/DisciplinesPageModal";
import { useStack } from "@/hooks/useStack";
import Dashboard from "@/components/dashboard/Dashboard";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

type ManagementPage = "none" | "users" | "event-types" | "stacks" | "disciplines";

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  const [currentManagementPage, setCurrentManagementPage] = useState<ManagementPage>("none");
  const [colorType] = useState<string>("minsait");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(0); // Para forçar refresh do dashboard
  const { stack } = useStack();

  const handleCloseModal = () => {
    setCurrentManagementPage("none");
  };

  // Atualiza o dashboard periodicamente quando um modal está aberto
  useEffect(() => {
    if (currentManagementPage !== "none") {
      const interval = setInterval(() => {
        setDashboardKey(prev => prev + 1);
      }, 5000); // Atualiza a cada 5 segundos quando modal está aberto

      return () => clearInterval(interval);
    }
  }, [currentManagementPage]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 px-2 py-2 ${colorType}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-minsait rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TF</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white-900">TaskFlow</h1>
              <p className="text-sm text-white-500 color-minsait">Gerenciamento de Tarefas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
                  <UserIcon className="w-4 h-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  <div className="flex flex-col space-y-1">
                    <span>Perfil: {user.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
                    {user.stack && <span>Stack: {user.stack}</span>}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowChangePassword(true)}>
                  <Key className="mr-2 h-4 w-4" />
                  <span>Alterar Senha</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user.role === "admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-black">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCurrentManagementPage("users")}>
                    Usuários
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentManagementPage("stacks")}>
                    Comunidades
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentManagementPage("event-types")}>
                    Eventos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentManagementPage("disciplines")}>
                    Disciplinas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="outline" className="text-black" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard sempre visível */}
      <main className="flex-1 pt-16">
        {currentManagementPage === "users" ? (
          <UsersPage stack={stack} colorType={colorType} onBack={handleCloseModal} />
        ) : (
          <Dashboard key={dashboardKey} colorType={colorType} user={user} />
        )}
      </main>

      {currentManagementPage === "event-types" && (
        <EventTypesPageModal onCancel={handleCloseModal} />
      )}

      {currentManagementPage === "stacks" && (
        <StacksPageModal onCancel={handleCloseModal} />
      )}

      {currentManagementPage === "disciplines" && (
        <DisciplinesPageModal onCancel={handleCloseModal} />
      )}

      {/* Modal de alteração de senha */}
      {showChangePassword && (
        <ChangePasswordForm
          onCancel={() => setShowChangePassword(false)}
          onSuccess={() => setShowChangePassword(false)}
        />
      )}
    </>
  );
};

export default Header;