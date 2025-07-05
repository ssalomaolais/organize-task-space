import { User } from "@/types/auth";
import { Header } from "@/components/shared/Header";
import { useState } from "react";


interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [colorType] = useState<string>("minsait");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user} colorType={colorType}  onLogout={onLogout}
      ></Header>
    </div>
  );
};

export default Dashboard;