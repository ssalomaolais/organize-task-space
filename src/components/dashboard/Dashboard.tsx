
import { User } from "@/types/auth";
import { useTasks } from "@/hooks/useTasks";
import { Header } from "@/components/shared/Header";


interface DashboardProps {
  user: User;
  colorType:string;
  onLogout: () => void;
}

const Dashboard = ({ user, colorType, onLogout }: DashboardProps) => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user} colorType={colorType}  onLogout={onLogout}
      ></Header>
    </div>
  );
};

export default Dashboard;