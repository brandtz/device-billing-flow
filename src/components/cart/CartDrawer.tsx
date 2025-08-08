import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

export function CartDrawer() {
  const { cart, cartItems, removeFromCart, updateQuantity, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart
          {itemCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.selected_pricing_option.name}
                        </p>
                        {item.selected_rate_plan && (
                          <p className="text-sm text-muted-foreground">
                            Plan: {item.selected_rate_plan.name}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.selected_features.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium mb-1">Add-ons:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.selected_features.map((feature) => (
                            <Badge key={feature.id} variant="secondary" className="text-xs">
                              {feature.name} (+${feature.monthly_cost}/mo)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.selected_pricing_option.down_payment * item.quantity).toFixed(2)} due now
                        </p>
                        {item.selected_pricing_option.monthly_payment && (
                          <p className="text-sm text-muted-foreground">
                            ${(item.selected_pricing_option.monthly_payment * item.quantity).toFixed(2)}/mo
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
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
                <Separator />
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
                <Button className="w-full mt-4" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}