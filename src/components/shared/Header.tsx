import { useState } from "react"; // Remova o useEffect não necessário
import { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/CalendarView.css";
import { User as UserIcon, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import UsersPage from "@/components/users/UsersPage";
import EventTypesPageModal from "@/components/event_types/EventTypesPageModal";
import StacksPageModal from "@/components/stacks/StacksPageModal";
import { useStack } from "@/hooks/useStack";
import DashboardPage from "../dashboard/DashboardPage";

type ManagementPage = "none" | "users" | "event-types" | "stacks";

interface HeaderProps {
  user: User;
  colorType: string;
  onLogout: () => void;
}

export const Header = ({ user, colorType, onLogout }: HeaderProps) => {
  const [currentManagementPage, setCurrentManagementPage] = useState<ManagementPage>("none");
  const { stack } = useStack();
  // Renderize os componentes condicionalmente no return principal
  const renderManagementPage = () => {
    switch (currentManagementPage) {
      case "users":
        return (
          <main className="flex-1 pt-16">
            <UsersPage stack={stack} colorType={colorType} onBack={() => setCurrentManagementPage("none")} />
          </main>);
      case "event-types":
        return (
          <EventTypesPageModal
            onCancel={() => {
              setCurrentManagementPage("none");
            }}
          />);
      case "stacks":
        return (
          <StacksPageModal
            onCancel={() => {
              setCurrentManagementPage("none");
            }}
          />
        )
      default:
        return (
          <main className="flex-1 pt-16"><DashboardPage colorType={colorType} user={user} />
          </main>);
    }
  };

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
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span>{user.name}</span>
            </div>
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
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="outline" className="text-black" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Renderize a página de gestão condicionalmente */}
      {renderManagementPage()}
    </>
  );
};

export default Header;