import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export const SubscriberManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscriber Management</h1>
        <p className="text-muted-foreground">Manage your subscribers and their services</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Subscriber Management
          </CardTitle>
          <CardDescription>
            View and manage all your subscribers in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Subscriber management features will be implemented here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};