import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, Calendar, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Account {
  id: string;
  name: string;
  current_balance: number;
  due_date: string;
  cycle_days_left: number;
  unbilled_usage: number;
  pending_charges: number;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      name: "Main Business Account",
      current_balance: 1247.50,
      due_date: "2024-01-15",
      cycle_days_left: 8,
      unbilled_usage: 156.75,
      pending_charges: 89.25
    },
    {
      id: "2", 
      name: "Secondary Location",
      current_balance: 523.10,
      due_date: "2024-01-18",
      cycle_days_left: 11,
      unbilled_usage: 67.50,
      pending_charges: 24.80
    }
  ]);

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

  const handleAddNewLines = () => {
    navigate('/order');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your accounts and services</p>
        </div>
        <Button onClick={handleAddNewLines} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Lines
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Selector</CardTitle>
          <CardDescription>Choose an account to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedAccountData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(selectedAccountData.current_balance)}</div>
              <p className="text-xs text-muted-foreground">Account balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(selectedAccountData.due_date)}</div>
              <p className="text-xs text-muted-foreground">Next payment due</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cycle Days Left</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{selectedAccountData.cycle_days_left}</div>
              <p className="text-xs text-muted-foreground">Days remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unbilled Usage</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(selectedAccountData.unbilled_usage)}</div>
              <p className="text-xs text-muted-foreground">Current period</p>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedAccountData && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Charges</CardTitle>
            <CardDescription>Outstanding charges for {selectedAccountData.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(selectedAccountData.pending_charges)}</p>
                <p className="text-sm text-muted-foreground">Pending charges this cycle</p>
              </div>
              <Badge variant="secondary">Processing</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};