import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import UsersPage from "@/pages/UsersPage";
import { useStack } from "@/hooks/useStack";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/shared/Header";
import { Loading } from "@/components/shared/loading";
import AuthPage from "@/components/auth/AuthPage";
import VacanciesPage from "@/pages/VacanciesPage";
import CommunityPage from "@/pages/CommunityPage";

const queryClient = new QueryClient();

function UserRoute() {
  const { stack } = useStack();
  const { user, loading, signOut } = useAuth();
  if (loading) return <Loading loading={loading} />;
  if (!user) return <AuthPage />;
  return <Header user={user} onLogout={signOut} initialManagementPage="users" />;
}

function VacanciesRoute() {
  const { user, loading, signOut } = useAuth();
  if (loading) return <Loading loading={loading} />;
  if (!user) return <AuthPage />;
  return <Header user={user} onLogout={signOut} initialManagementPage="vacancies" />;
}

function CommunityRoute() {
  const { user, loading, signOut } = useAuth();
  if (loading) return <Loading loading={loading} />;
  if (!user) return <AuthPage />;
  return <Header user={user} onLogout={signOut} initialManagementPage="stacks" />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/index.html" element={<Index />} />
          <Route path="/user" element={<UserRoute />} />
          <Route path="/vacancies" element={<VacanciesRoute />} />
          <Route path="/community" element={<CommunityRoute />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
