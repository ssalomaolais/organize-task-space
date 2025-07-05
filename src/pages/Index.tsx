
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/dashboard/Dashboard";
import AuthPage from "@/components/auth/AuthPage";
import { useState } from "react";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [colorType] = useState<string >("minsait");
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">TF</span>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Dashboard user={user}  colorType={colorType} onLogout={signOut} />;
};

export default Index;
