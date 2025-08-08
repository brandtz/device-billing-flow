import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/layout/Navigation";
import { LoginForm } from "./components/auth/LoginForm";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Orders } from "./pages/Orders";
import { Subscribers } from "./pages/Subscribers";
import { Billing } from "./pages/Billing";
import { Checkout } from "./pages/Checkout";
import { Order } from "./pages/Order";
import { SubscriberManagement } from "./pages/SubscriberManagement";
import { Reporting } from "./pages/Reporting";
import { ProfileManagement } from "./pages/ProfileManagement";
import { ManageProducts } from "./pages/admin/ManageProducts";
import { ManageRatePlans } from "./pages/admin/ManageRatePlans";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { useUserRole } from "./hooks/useUserRole";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const { userRole, loading: roleLoading } = useUserRole(user);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginForm onLogin={signIn} onRegister={signUp} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation userRole={userRole} onLogout={signOut} />
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order" element={<Order />} />
                <Route path="/subscribers" element={<Subscribers />} />
                <Route path="/subscriber-management" element={<SubscriberManagement />} />
                <Route path="/reporting" element={<Reporting />} />
                <Route path="/profile" element={<ProfileManagement />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin/products" element={<ManageProducts />} />
                <Route path="/admin/rate-plans" element={<ManageRatePlans />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
