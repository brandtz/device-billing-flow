import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Order = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order New Services</h1>
          <p className="text-muted-foreground">Start your ordering process</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Step 1: Order Configuration
          </CardTitle>
          <CardDescription>
            This is the first step of the ordering flow. Additional steps will be implemented based on your requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Order flow implementation coming soon...
            </p>
            <Button onClick={() => navigate('/products')}>
              View Available Products
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};