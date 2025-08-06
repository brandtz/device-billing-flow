import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

// Mock data - will be replaced with Supabase queries
const mockOrders = [
  {
    id: '1',
    internal_order_number: 'CC-2024-001',
    status: 'delivered' as const,
    total_amount: 1079,
    created_at: '2024-01-15T10:30:00Z',
    tracking_number: '1Z999AA1234567890',
    estimated_delivery: '2024-01-18',
    order_items: [
      {
        id: '1',
        product: { name: 'iPhone 15 Pro', category: 'phone' },
        rate_plan: { name: 'Unlimited Plus', monthly_cost: 80 },
        quantity: 1,
        unit_price: 999,
        monthly_recurring_cost: 80,
        device_details: {
          sim_number: 'SIM123456789',
          imei: '123456789012345',
          phone_number: '+1-555-0123',
          activation_date: '2024-01-19'
        }
      }
    ]
  },
  {
    id: '2',
    internal_order_number: 'CC-2024-002',
    status: 'shipped' as const,
    total_amount: 859,
    created_at: '2024-01-20T14:15:00Z',
    tracking_number: '1Z999AA1234567891',
    estimated_delivery: '2024-01-25',
    order_items: [
      {
        id: '2',
        product: { name: 'Samsung Galaxy Tab S9', category: 'tablet' },
        rate_plan: { name: 'Business 50GB', monthly_cost: 60 },
        quantity: 1,
        unit_price: 799,
        monthly_recurring_cost: 60
      }
    ]
  },
  {
    id: '3',
    internal_order_number: 'CC-2024-003',
    status: 'processing' as const,
    total_amount: 224,
    created_at: '2024-01-22T09:00:00Z',
    order_items: [
      {
        id: '3',
        product: { name: 'Verizon Jetpack MiFi', category: 'hotspot' },
        rate_plan: { name: 'IoT Data 10GB', monthly_cost: 25 },
        quantity: 1,
        unit_price: 199,
        monthly_recurring_cost: 25
      }
    ]
  }
];

export const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'processing': return 'secondary';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Order History</h1>
        <p className="text-muted-foreground">Track your orders and view order details</p>
      </div>

      <div className="grid gap-6">
        {mockOrders.map((order) => (
          <Card key={order.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Order #{order.internal_order_number}
                    <Badge 
                      variant={getStatusColor(order.status) as any}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Placed on {formatDate(order.created_at)}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${order.total_amount}</div>
                  {order.tracking_number && (
                    <div className="text-sm text-muted-foreground">
                      Tracking: {order.tracking_number}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {order.order_items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.product.category} • Quantity: {item.quantity}
                        </p>
                        {item.rate_plan && (
                          <p className="text-sm text-muted-foreground">
                            Rate Plan: {item.rate_plan.name} (${item.rate_plan.monthly_cost}/month)
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${item.unit_price}</div>
                        {item.monthly_recurring_cost > 0 && (
                          <div className="text-sm text-muted-foreground">
                            +${item.monthly_recurring_cost}/month
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Device Details */}
                    {item.device_details && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Device Details</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {item.device_details.phone_number && (
                            <div>
                              <span className="text-muted-foreground">Phone:</span>{' '}
                              {item.device_details.phone_number}
                            </div>
                          )}
                          {item.device_details.sim_number && (
                            <div>
                              <span className="text-muted-foreground">SIM:</span>{' '}
                              {item.device_details.sim_number}
                            </div>
                          )}
                          {item.device_details.imei && (
                            <div>
                              <span className="text-muted-foreground">IMEI:</span>{' '}
                              {item.device_details.imei}
                            </div>
                          )}
                          {item.device_details.activation_date && (
                            <div>
                              <span className="text-muted-foreground">Activated:</span>{' '}
                              {formatDate(item.device_details.activation_date)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {order.estimated_delivery && order.status !== 'delivered' && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm">
                      <strong>Estimated Delivery:</strong> {formatDate(order.estimated_delivery)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>

            {order.tracking_number && (
              <div className="px-6 pb-6">
                <Button variant="outline" className="w-full">
                  Track Package
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};