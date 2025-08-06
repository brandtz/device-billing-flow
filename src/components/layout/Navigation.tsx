import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  User
} from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  userRole?: 'customer' | 'admin';
  onLogout?: () => void;
}

export const Navigation = ({ userRole = 'customer', onLogout }: NavigationProps) => {
  const [activeTab, setActiveTab] = useState('products');

  const customerTabs = [
    { id: 'products', label: 'Products', icon: ShoppingCart, path: '/products' },
    { id: 'orders', label: 'Order History', icon: Package, path: '/orders' },
    { id: 'subscribers', label: 'Subscriber Management', icon: Users, path: '/subscribers' },
    { id: 'billing', label: 'Billing Reports', icon: BarChart3, path: '/billing' },
  ];

  const adminTabs = [
    { id: 'admin-products', label: 'Manage Products', icon: ShoppingCart, path: '/admin/products' },
    { id: 'admin-orders', label: 'All Orders', icon: Package, path: '/admin/orders' },
    { id: 'admin-accounts', label: 'Customer Accounts', icon: Users, path: '/admin/accounts' },
    { id: 'admin-settings', label: 'System Settings', icon: Settings, path: '/admin/settings' },
  ];

  const tabs = userRole === 'admin' ? adminTabs : customerTabs;

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-foreground">
              CarrierCorp {userRole === 'admin' ? 'Admin' : 'Portal'}
            </h1>
            
            <div className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="flex items-center gap-2"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};