import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CheckoutData, Address } from "@/types/cart";
import { useToast } from "@/hooks/use-toast";

export function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    cart,
    addresses: {
      shipping: {
        type: 'shipping',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'US'
      },
      billing: {
        type: 'billing',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'US'
      },
      ppu: {
        type: 'ppu',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'US'
      },
      e911: {
        type: 'e911',
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'US'
      }
    },
    customer_info: {
      first_name: '',
      last_name: '',
      email: '',
      phone: ''
    },
    use_shipping_for_ppu: true,
    use_shipping_for_e911: true,
    use_shipping_for_billing: false,
    special_instructions: ''
  });

  const updateAddress = (type: keyof CheckoutData['addresses'], field: keyof Address, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        [type]: {
          ...prev.addresses[type],
          [field]: value
        }
      }
    }));
  };

  const updateCustomerInfo = (field: keyof CheckoutData['customer_info'], value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      customer_info: {
        ...prev.customer_info,
        [field]: value
      }
    }));
  };

  const handleSubmitOrder = async () => {
    // Validate required fields
    if (!checkoutData.customer_info.first_name || !checkoutData.customer_info.last_name || 
        !checkoutData.customer_info.email || !checkoutData.addresses.shipping.street_address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Copy shipping address to other addresses if checkboxes are checked
    const finalData = { ...checkoutData };
    if (checkoutData.use_shipping_for_ppu) {
      finalData.addresses.ppu = { ...checkoutData.addresses.shipping, type: 'ppu' };
    }
    if (checkoutData.use_shipping_for_e911) {
      finalData.addresses.e911 = { ...checkoutData.addresses.shipping, type: 'e911' };
    }
    if (checkoutData.use_shipping_for_billing) {
      finalData.addresses.billing = { ...checkoutData.addresses.shipping, type: 'billing' };
    }

    try {
      // TODO: Submit order to backend/external API
      console.log('Submitting order:', finalData);
      
      toast({
        title: "Order Submitted",
        description: "Your order has been submitted successfully!",
      });
      
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={checkoutData.customer_info.first_name}
                    onChange={(e) => updateCustomerInfo('first_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={checkoutData.customer_info.last_name}
                    onChange={(e) => updateCustomerInfo('last_name', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={checkoutData.customer_info.email}
                  onChange={(e) => updateCustomerInfo('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={checkoutData.customer_info.phone}
                  onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingStreet">Street Address *</Label>
                <Input
                  id="shippingStreet"
                  value={checkoutData.addresses.shipping.street_address}
                  onChange={(e) => updateAddress('shipping', 'street_address', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shippingStreet2">Apartment, suite, etc. (optional)</Label>
                <Input
                  id="shippingStreet2"
                  value={checkoutData.addresses.shipping.street_address_2 || ''}
                  onChange={(e) => updateAddress('shipping', 'street_address_2', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="shippingCity">City *</Label>
                  <Input
                    id="shippingCity"
                    value={checkoutData.addresses.shipping.city}
                    onChange={(e) => updateAddress('shipping', 'city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="shippingState">State *</Label>
                  <Input
                    id="shippingState"
                    value={checkoutData.addresses.shipping.state}
                    onChange={(e) => updateAddress('shipping', 'state', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="shippingZip">ZIP Code *</Label>
                  <Input
                    id="shippingZip"
                    value={checkoutData.addresses.shipping.zip_code}
                    onChange={(e) => updateAddress('shipping', 'zip_code', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Options */}
          <Card>
            <CardHeader>
              <CardTitle>Address Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useBilling"
                  checked={checkoutData.use_shipping_for_billing}
                  onCheckedChange={(checked) => 
                    setCheckoutData(prev => ({ ...prev, use_shipping_for_billing: !!checked }))
                  }
                />
                <Label htmlFor="useBilling">Use shipping address for billing</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usePPU"
                  checked={checkoutData.use_shipping_for_ppu}
                  onCheckedChange={(checked) => 
                    setCheckoutData(prev => ({ ...prev, use_shipping_for_ppu: !!checked }))
                  }
                />
                <Label htmlFor="usePPU">Use shipping address for Principal Place of Use (PPU)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useE911"
                  checked={checkoutData.use_shipping_for_e911}
                  onCheckedChange={(checked) => 
                    setCheckoutData(prev => ({ ...prev, use_shipping_for_e911: !!checked }))
                  }
                />
                <Label htmlFor="useE911">Use shipping address for E911 emergency services</Label>
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special delivery or setup instructions..."
                value={checkoutData.special_instructions || ''}
                onChange={(e) => setCheckoutData(prev => ({ ...prev, special_instructions: e.target.value }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.selected_pricing_option.name} × {item.quantity}
                      </p>
                      {item.selected_rate_plan && (
                        <Badge variant="outline" className="text-xs">
                          {item.selected_rate_plan.name}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.selected_pricing_option.down_payment * item.quantity).toFixed(2)}
                      </p>
                      {item.selected_pricing_option.monthly_payment && (
                        <p className="text-xs text-muted-foreground">
                          +${(item.selected_pricing_option.monthly_payment * item.quantity).toFixed(2)}/mo
                        </p>
                      )}
                    </div>
                  </div>
                  {item.selected_features.length > 0 && (
                    <div className="pl-4 space-y-1">
                      {item.selected_features.map((feature) => (
                        <div key={feature.id} className="flex justify-between text-sm">
                          <span>{feature.name}</span>
                          <span>+${(feature.monthly_cost * item.quantity).toFixed(2)}/mo</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes:</span>
                  <span>${cart.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>${cart.fees.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between font-medium text-lg">
                  <span>Due Now:</span>
                  <span>${cart.total_due_now.toFixed(2)}</span>
                </div>
                {cart.total_monthly_charges > 0 && (
                  <div className="flex justify-between font-medium">
                    <span>Monthly Charges:</span>
                    <span>${cart.total_monthly_charges.toFixed(2)}/mo</span>
                  </div>
                )}
              </div>
              
              <Button className="w-full mt-6" onClick={handleSubmitOrder}>
                Submit Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}