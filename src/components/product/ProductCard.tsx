import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Smartphone, Tablet, Wifi, Cpu } from "lucide-react";
import { Product, RatePlan, Feature, PricingOption } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  availableRatePlans: RatePlan[];
  availableFeatures: Feature[];
}

export function ProductCard({ product, availableRatePlans, availableFeatures }: ProductCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPricingOption, setSelectedPricingOption] = useState<PricingOption | null>(
    product.pricing_options.find(opt => opt.is_default) || product.pricing_options[0] || null
  );
  const [selectedRatePlan, setSelectedRatePlan] = useState<RatePlan | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  const categoryIcons = {
    phone: Smartphone,
    tablet: Tablet,
    hotspot: Wifi,
    iot: Cpu
  };

  const Icon = categoryIcons[product.category];

  const handleAddToCart = () => {
    if (!selectedPricingOption) {
      toast({
        title: "Selection Required",
        description: "Please select a pricing option",
        variant: "destructive"
      });
      return;
    }

    addToCart(product, selectedPricingOption, selectedRatePlan || undefined, selectedFeatures);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    });
    setIsDialogOpen(false);
  };

  const toggleFeature = (feature: Feature) => {
    setSelectedFeatures(prev => {
      const exists = prev.find(f => f.id === feature.id);
      if (exists) {
        return prev.filter(f => f.id !== feature.id);
      } else {
        return [...prev, feature];
      }
    });
  };

  const calculateMonthlyTotal = () => {
    let total = selectedPricingOption?.monthly_payment || 0;
    if (selectedRatePlan) {
      total += selectedRatePlan.monthly_cost;
    }
    selectedFeatures.forEach(feature => {
      total += feature.monthly_cost;
    });
    return total;
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-primary" />
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-3">
          {product.pricing_options.length > 0 && (
            <div>
              <div className="text-2xl font-bold text-primary">
                {product.pricing_options.find(opt => opt.is_default)?.down_payment 
                  ? `$${product.pricing_options.find(opt => opt.is_default)?.down_payment} down`
                  : `$${product.price}`}
              </div>
              {product.pricing_options.find(opt => opt.is_default)?.monthly_payment && (
                <div className="text-sm text-muted-foreground">
                  +${product.pricing_options.find(opt => opt.is_default)?.monthly_payment}/mo
                </div>
              )}
            </div>
          )}
          
          {product.features && product.features.length > 0 && (
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Features:</h4>
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Configure & Add to Cart
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure {product.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Pricing Options */}
              {product.pricing_options.length > 0 && (
                <div>
                  <Label className="text-base font-medium">Pricing Options</Label>
                  <div className="grid gap-3 mt-2">
                    {product.pricing_options.map((option) => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-3 cursor-pointer ${
                          selectedPricingOption?.id === option.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onClick={() => setSelectedPricingOption(option)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{option.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${option.down_payment} down
                              {option.monthly_payment && ` + $${option.monthly_payment}/mo`}
                              {option.term_months && ` for ${option.term_months} months`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${option.total_cost} total</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rate Plans */}
              {availableRatePlans.length > 0 && (
                <div>
                  <Label className="text-base font-medium">Rate Plan (Optional)</Label>
                  <Select value={selectedRatePlan?.id || ""} onValueChange={(value) => {
                    const plan = availableRatePlans.find(p => p.id === value);
                    setSelectedRatePlan(plan || null);
                  }}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a rate plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No rate plan</SelectItem>
                      {availableRatePlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.monthly_cost}/mo
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Features */}
              {availableFeatures.length > 0 && (
                <div>
                  <Label className="text-base font-medium">Add-ons & Features</Label>
                  <div className="space-y-2 mt-2">
                    {availableFeatures.map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={feature.id}
                            checked={selectedFeatures.some(f => f.id === feature.id)}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <div>
                            <Label htmlFor={feature.id} className="font-medium">
                              {feature.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${feature.monthly_cost}/mo</p>
                          <Badge variant="outline" className="text-xs">
                            {feature.feature_type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Summary */}
              <div className="space-y-2">
                <h4 className="font-medium">Summary</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Due Today:</span>
                    <span className="font-medium">
                      ${selectedPricingOption?.down_payment || 0}
                    </span>
                  </div>
                  {calculateMonthlyTotal() > 0 && (
                    <div className="flex justify-between">
                      <span>Monthly Charges:</span>
                      <span className="font-medium">
                        ${calculateMonthlyTotal().toFixed(2)}/mo
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddToCart} className="flex-1">
                  Add to Cart
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}