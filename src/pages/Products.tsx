import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, RatePlan, Feature } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ratePlansRes, featuresRes] = await Promise.all([
        (supabase as any).from('products').select('*').eq('active', true),
        (supabase as any).from('rate_plans').select('*').eq('active', true),
        (supabase as any).from('features').select('*')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (ratePlansRes.error) throw ratePlansRes.error;
      if (featuresRes.error) throw featuresRes.error;

      // Add mock pricing options for now since they're not in the database yet
      const productsWithPricing = (productsRes.data || []).map(product => ({
        ...product,
        pricing_options: [
          {
            id: `${product.id}-full`,
            name: "Pay in Full",
            type: 'full_payment' as const,
            down_payment: product.price,
            total_cost: product.price,
            is_default: true
          },
          {
            id: `${product.id}-financed`,
            name: "Monthly Financed",
            type: 'financed' as const,
            down_payment: Math.round(product.price * 0.1), // 10% down
            monthly_payment: Math.round((product.price * 0.9) / 24), // 24 months
            term_months: 24,
            total_cost: product.price,
            is_default: false
          }
        ]
      }));

      setProducts(productsWithPricing);
      setRatePlans(ratePlansRes.data || []);
      setFeatures(featuresRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load products and services",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'phone', label: 'Phones' },
    { id: 'tablet', label: 'Tablets' },
    { id: 'hotspot', label: 'Hotspots' },
    { id: 'iot', label: 'IoT Devices' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Products & Services</h1>
        <p className="text-muted-foreground">Browse our selection of devices, rate plans, and add-ons</p>
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
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                availableRatePlans={ratePlans}
                availableFeatures={features}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};