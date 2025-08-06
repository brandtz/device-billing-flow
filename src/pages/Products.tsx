import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Smartphone, Tablet, Wifi, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - will be replaced with Supabase queries
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system',
    category: 'phone' as const,
    price: 999,
    image_url: '',
    is_active: true,
    specifications: { storage: '128GB', color: 'Natural Titanium' }
  },
  {
    id: '2',
    name: 'Samsung Galaxy Tab S9',
    description: 'Premium Android tablet for productivity',
    category: 'tablet' as const,
    price: 799,
    image_url: '',
    is_active: true,
    specifications: { storage: '256GB', display: '11-inch' }
  },
  {
    id: '3',
    name: 'Verizon Jetpack MiFi',
    description: 'Portable 5G hotspot device',
    category: 'hotspot' as const,
    price: 199,
    image_url: '',
    is_active: true,
    specifications: { connectivity: '5G', battery: '24 hours' }
  },
  {
    id: '4',
    name: 'IoT Sensor Pro',
    description: 'Industrial IoT monitoring device',
    category: 'iot' as const,
    price: 149,
    image_url: '',
    is_active: true,
    specifications: { sensors: 'Temperature, Humidity', connectivity: 'LTE-M' }
  }
];

const mockRatePlans = [
  { id: '1', name: 'Unlimited Plus', monthly_cost: 80, description: 'Unlimited data, talk, text' },
  { id: '2', name: 'Business 50GB', monthly_cost: 60, description: '50GB high-speed data' },
  { id: '3', name: 'IoT Data 10GB', monthly_cost: 25, description: '10GB for IoT devices' }
];

export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<any[]>([]);
  const { toast } = useToast();

  const categoryIcons = {
    phone: Smartphone,
    tablet: Tablet,
    hotspot: Wifi,
    iot: Cpu
  };

  const filteredProducts = selectedCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => product.category === selectedCategory);

  const addToCart = (product: any) => {
    setCart([...cart, product]);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'phone', label: 'Phones' },
    { id: 'tablet', label: 'Tablets' },
    { id: 'hotspot', label: 'Hotspots' },
    { id: 'iot', label: 'IoT Devices' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products & Services</h1>
          <p className="text-muted-foreground">Browse our selection of devices and rate plans</p>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="font-medium">{cart.length} items in cart</span>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const Icon = categoryIcons[product.category];
              return (
                <Card key={product.id} className="flex flex-col">
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
                      <div className="text-2xl font-bold text-primary">
                        ${product.price}
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">Specifications:</h4>
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="text-sm text-muted-foreground">
                            <span className="capitalize">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-3">
                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Details & Rate Plans
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Rate Plans Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Available Rate Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockRatePlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  ${plan.monthly_cost}
                  <span className="text-sm text-muted-foreground font-normal">/month</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Select Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};