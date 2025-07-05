
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/components/auth/AuthPage";
import { Loading } from "@/components/shared/loading";
import Header from "@/components/shared/Header";

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

  return <Header user={user} onLogout={signOut} />;
};

export default Index;
