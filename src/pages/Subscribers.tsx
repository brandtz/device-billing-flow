import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Edit, Phone, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - will be replaced with Supabase queries
const mockSubscribers = [
  {
    id: '1',
    phone_number: '+1-555-0123',
    sim_number: 'SIM123456789',
    imei: '123456789012345',
    status: 'active' as const,
    activation_date: '2024-01-19',
    rate_plan: { name: 'Unlimited Plus', monthly_cost: 80 },
    features: [
      { name: 'International Roaming', monthly_cost: 15 },
      { name: 'Premium Data', monthly_cost: 10 }
    ],
    monthly_cost: 105,
    user_name: 'John Doe',
    custom_field_1_label: 'Department',
    custom_field_1_value: 'Sales',
    custom_field_2_label: 'Cost Center',
    custom_field_2_value: 'CC-001',
    custom_field_3_label: 'Employee ID',
    custom_field_3_value: 'EMP12345',
    custom_field_4_label: 'Location',
    custom_field_4_value: 'New York'
  },
  {
    id: '2',
    phone_number: '+1-555-0124',
    sim_number: 'SIM123456790',
    imei: '123456789012346',
    status: 'active' as const,
    activation_date: '2024-01-20',
    rate_plan: { name: 'Business 50GB', monthly_cost: 60 },
    features: [],
    monthly_cost: 60,
    user_name: 'Jane Smith',
    custom_field_1_label: 'Department',
    custom_field_1_value: 'Marketing',
    custom_field_2_label: 'Cost Center',
    custom_field_2_value: 'CC-002'
  }
];

export const Subscribers = () => {
  const [subscribers, setSubscribers] = useState(mockSubscribers);
  const [editingSubscriber, setEditingSubscriber] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'suspended': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = (subscriber: any) => {
    setEditingSubscriber(subscriber);
    setFormData({
      user_name: subscriber.user_name || '',
      custom_field_1_label: subscriber.custom_field_1_label || '',
      custom_field_1_value: subscriber.custom_field_1_value || '',
      custom_field_2_label: subscriber.custom_field_2_label || '',
      custom_field_2_value: subscriber.custom_field_2_value || '',
      custom_field_3_label: subscriber.custom_field_3_label || '',
      custom_field_3_value: subscriber.custom_field_3_value || '',
      custom_field_4_label: subscriber.custom_field_4_label || '',
      custom_field_4_value: subscriber.custom_field_4_value || ''
    });
  };

  const handleSave = () => {
    // Update subscriber in the list
    setSubscribers(subscribers.map(sub => 
      sub.id === editingSubscriber.id 
        ? { ...sub, ...formData }
        : sub
    ));
    
    setEditingSubscriber(null);
    toast({
      title: "Subscriber updated",
      description: "Custom fields have been saved successfully."
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subscriber Management</h1>
        <p className="text-muted-foreground">Manage your active subscribers and customize line details</p>
      </div>

      <div className="grid gap-6">
        {subscribers.map((subscriber) => (
          <Card key={subscriber.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {subscriber.phone_number}
                    <Badge variant={getStatusColor(subscriber.status) as any}>
                      {subscriber.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {subscriber.user_name && `${subscriber.user_name} • `}
                    Activated on {formatDate(subscriber.activation_date)}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${subscriber.monthly_cost}</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Device Information */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Device Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">SIM Number:</span>
                      <div className="font-mono">{subscriber.sim_number}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">IMEI:</span>
                      <div className="font-mono">{subscriber.imei}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Rate Plan & Features */}
                <div>
                  <h4 className="font-medium mb-3">Rate Plan & Features</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{subscriber.rate_plan.name}</span>
                      <span>${subscriber.rate_plan.monthly_cost}/month</span>
                    </div>
                    {subscriber.features.map((feature, index) => (
                      <div key={index} className="flex justify-between text-sm text-muted-foreground">
                        <span>{feature.name}</span>
                        <span>+${feature.monthly_cost}/month</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Custom Fields */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Custom Information</h4>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(subscriber)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Subscriber Information</DialogTitle>
                          <DialogDescription>
                            Customize the user name and up to 4 additional fields for this subscriber.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="user_name">User Name</Label>
                            <Input
                              id="user_name"
                              value={formData.user_name || ''}
                              onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                              placeholder="Enter user name"
                            />
                          </div>

                          {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`custom_field_${num}_label`}>Field {num} Label</Label>
                                <Input
                                  id={`custom_field_${num}_label`}
                                  value={formData[`custom_field_${num}_label`] || ''}
                                  onChange={(e) => setFormData({ 
                                    ...formData, 
                                    [`custom_field_${num}_label`]: e.target.value 
                                  })}
                                  placeholder={`e.g., Department, Cost Center`}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`custom_field_${num}_value`}>Field {num} Value</Label>
                                <Input
                                  id={`custom_field_${num}_value`}
                                  value={formData[`custom_field_${num}_value`] || ''}
                                  onChange={(e) => setFormData({ 
                                    ...formData, 
                                    [`custom_field_${num}_value`]: e.target.value 
                                  })}
                                  placeholder="Enter value"
                                />
                              </div>
                            </div>
                          ))}

                          <div className="flex justify-end gap-2 pt-4">
                            <DialogTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogTrigger>
                            <DialogTrigger asChild>
                              <Button onClick={handleSave}>Save Changes</Button>
                            </DialogTrigger>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[1, 2, 3, 4].map((num) => {
                      const label = subscriber[`custom_field_${num}_label`];
                      const value = subscriber[`custom_field_${num}_value`];
                      
                      if (!label && !value) return null;
                      
                      return (
                        <div key={num}>
                          <span className="text-muted-foreground">{label || `Custom Field ${num}`}:</span>
                          <div>{value || 'Not set'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};