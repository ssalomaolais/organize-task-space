
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/dashboard/Dashboard";
import AuthPage from "@/components/auth/AuthPage";
import { Loading } from "@/components/shared/loading";

const Index = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <Loading loading={loading} />
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Dashboard user={user} onLogout={signOut} />;
};

export default Index;
