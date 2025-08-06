import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, FileText, Filter, Download } from "lucide-react";

// Mock billing data - will be replaced with Supabase queries
const mockBillingReports = [
  {
    id: '1',
    billing_period_start: '2024-01-01',
    billing_period_end: '2024-01-31',
    total_charges: 2150.75,
    line_items: [
      {
        id: '1',
        phone_number: '+1-555-0123',
        line_description: 'Unlimited Plus Plan',
        charge_type: 'recurring',
        amount: 80.00,
        custom_field_1_value: 'Sales',
        custom_field_2_value: 'CC-001'
      },
      {
        id: '2',
        phone_number: '+1-555-0123',
        line_description: 'International Roaming',
        charge_type: 'recurring',
        amount: 15.00,
        custom_field_1_value: 'Sales',
        custom_field_2_value: 'CC-001'
      },
      {
        id: '3',
        phone_number: '+1-555-0124',
        line_description: 'Business 50GB Plan',
        charge_type: 'recurring',
        amount: 60.00,
        custom_field_1_value: 'Marketing',
        custom_field_2_value: 'CC-002'
      },
      {
        id: '4',
        phone_number: '+1-555-0123',
        line_description: 'Device Payment',
        charge_type: 'one_time',
        amount: 41.62,
        custom_field_1_value: 'Sales',
        custom_field_2_value: 'CC-001'
      }
    ]
  }
];

export const Billing = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [filterValue, setFilterValue] = useState<string>('');
  
  const currentReport = mockBillingReports[0]; // In real app, this would be filtered by selectedPeriod

  const getChargeTypeColor = (type: string) => {
    switch (type) {
      case 'recurring': return 'default';
      case 'one_time': return 'secondary';
      case 'usage': return 'outline';
      case 'fee': return 'destructive';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter line items based on current filters
  const filteredLineItems = currentReport.line_items.filter(item => {
    if (filterBy === 'all') return true;
    
    if (filterBy === 'department' && filterValue) {
      return item.custom_field_1_value?.toLowerCase().includes(filterValue.toLowerCase());
    }
    
    if (filterBy === 'cost_center' && filterValue) {
      return item.custom_field_2_value?.toLowerCase().includes(filterValue.toLowerCase());
    }
    
    if (filterBy === 'charge_type' && filterValue) {
      return item.charge_type === filterValue;
    }
    
    return true;
  });

  // Calculate summary by department
  const departmentSummary = currentReport.line_items.reduce((acc, item) => {
    const dept = item.custom_field_1_value || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalFilteredCharges = filteredLineItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing Reports</h1>
          <p className="text-muted-foreground">View and analyze your billing data with custom filters</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Billing Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Billing Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="period">Select Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">January 2024</SelectItem>
                  <SelectItem value="2023-12">December 2023</SelectItem>
                  <SelectItem value="2023-11">November 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Charges</div>
              <div className="text-2xl font-bold">${currentReport.total_charges.toFixed(2)}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Period: {formatDate(currentReport.billing_period_start)} - {formatDate(currentReport.billing_period_end)}
          </p>
        </CardContent>
      </Card>

      {/* Department Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Department Summary
          </CardTitle>
          <CardDescription>
            Charges grouped by department custom field
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(departmentSummary).map(([dept, amount]) => (
              <div key={dept} className="p-4 bg-muted rounded-lg">
                <div className="font-medium">{dept}</div>
                <div className="text-2xl font-bold text-primary">${amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Charges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filter-by">Filter By</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Charges</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="cost_center">Cost Center</SelectItem>
                  <SelectItem value="charge_type">Charge Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filterBy !== 'all' && filterBy !== 'charge_type' && (
              <div>
                <Label htmlFor="filter-value">Filter Value</Label>
                <Input
                  id="filter-value"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder={`Enter ${filterBy === 'department' ? 'department' : 'cost center'} name`}
                />
              </div>
            )}
            
            {filterBy === 'charge_type' && (
              <div>
                <Label htmlFor="charge-type">Charge Type</Label>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select charge type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="one_time">One Time</SelectItem>
                    <SelectItem value="usage">Usage</SelectItem>
                    <SelectItem value="fee">Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex items-end">
              <Button variant="outline" onClick={() => { setFilterBy('all'); setFilterValue(''); }}>
                Clear Filters
              </Button>
            </div>
          </div>
          
          {filteredLineItems.length !== currentReport.line_items.length && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm">
                Showing {filteredLineItems.length} of {currentReport.line_items.length} charges 
                (${totalFilteredCharges.toFixed(2)} total)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Line Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Line Items</CardTitle>
          <CardDescription>
            Detailed breakdown of all charges for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Cost Center</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.phone_number}</TableCell>
                  <TableCell>{item.line_description}</TableCell>
                  <TableCell>
                    <Badge variant={getChargeTypeColor(item.charge_type) as any}>
                      {item.charge_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.custom_field_1_value || '-'}</TableCell>
                  <TableCell>{item.custom_field_2_value || '-'}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${item.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};