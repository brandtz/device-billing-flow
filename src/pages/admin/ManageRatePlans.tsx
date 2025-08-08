import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RatePlan {
  id: string;
  name: string;
  description: string | null;
  monthly_cost: number;
  data_limit: string | null;
  features: string[] | null;
  active: boolean;
  created_at: string;
}

export const ManageRatePlans = () => {
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<RatePlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    monthly_cost: "",
    data_limit: "",
    active: true,
    features: ""
  });

  useEffect(() => {
    fetchRatePlans();
  }, []);

  const fetchRatePlans = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('rate_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRatePlans(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch rate plans",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      monthly_cost: "",
      data_limit: "",
      active: true,
      features: ""
    });
    setEditingPlan(null);
  };

  const handleEdit = (plan: RatePlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      monthly_cost: plan.monthly_cost.toString(),
      data_limit: plan.data_limit || "",
      active: plan.active,
      features: Array.isArray(plan.features) ? plan.features.join(", ") : ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const planData = {
      name: formData.name,
      description: formData.description,
      monthly_cost: parseFloat(formData.monthly_cost),
      data_limit: formData.data_limit,
      active: formData.active,
      features: formData.features ? formData.features.split(",").map(f => f.trim()) : []
    };

    try {
      if (editingPlan) {
        const { error } = await (supabase as any)
          .from('rate_plans')
          .update(planData)
          .eq('id', editingPlan.id);
        if (error) throw error;
        toast({ title: "Success", description: "Rate plan updated successfully" });
      } else {
        const { error } = await (supabase as any)
          .from('rate_plans')
          .insert(planData);
        if (error) throw error;
        toast({ title: "Success", description: "Rate plan created successfully" });
      }

      await fetchRatePlans();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save rate plan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlanVisibility = async (plan: RatePlan) => {
    try {
      const { error } = await (supabase as any)
        .from('rate_plans')
        .update({ active: !plan.active })
        .eq('id', plan.id);

      if (error) throw error;
      await fetchRatePlans();
      toast({
        title: "Success",
        description: `Rate plan ${plan.active ? 'hidden' : 'made visible'}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update rate plan visibility",
        variant: "destructive"
      });
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this rate plan?")) return;

    try {
      const { error } = await (supabase as any)
        .from('rate_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      await fetchRatePlans();
      toast({ title: "Success", description: "Rate plan deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete rate plan",
        variant: "destructive"
      });
    }
  };

  if (isLoading && ratePlans.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rate plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Rate Plans</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Rate Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Edit Rate Plan" : "Add New Rate Plan"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthly_cost">Monthly Cost ($)</Label>
                  <Input
                    id="monthly_cost"
                    type="number"
                    step="0.01"
                    value={formData.monthly_cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthly_cost: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="data_limit">Data Limit</Label>
                  <Input
                    id="data_limit"
                    value={formData.data_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_limit: e.target.value }))}
                    placeholder="e.g., Unlimited, 5GB, 10GB"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="features">Features (comma separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="5G Access, Mobile Hotspot, International Roaming"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Rate Plan Active/Visible</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {editingPlan ? "Update" : "Create"} Rate Plan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ratePlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={plan.active ? "default" : "secondary"}>
                      {plan.active ? "Active" : "Hidden"}
                    </Badge>
                    {plan.data_limit && (
                      <Badge variant="outline">{plan.data_limit}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePlanVisibility(plan)}
                  >
                    {plan.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletePlan(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
              <div className="space-y-1">
                <p className="font-semibold text-lg">${plan.monthly_cost}/month</p>
                {plan.features && plan.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {plan.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{plan.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};