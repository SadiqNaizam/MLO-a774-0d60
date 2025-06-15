import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Custom Components
import NavigationMenu from '@/components/layout/NavigationMenu';
import OrderTracker from '@/components/OrderTracker';

// shadcn/ui Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

// Icons
import { User, MapPin, CreditCardIcon, ListOrdered, ShoppingBag, Edit3, CheckCircle, Package, Truck, UtensilsCrossed } from 'lucide-react';


const profileFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number."),
  // password: z.string().min(6, "Password must be at least 6 characters.").optional(), // For password change
});

const addressFormSchema = z.object({
  label: z.string().min(2, "Label is required (e.g., Home, Work)."),
  street: z.string().min(5, "Street address is required."),
  city: z.string().min(2, "City is required."),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code."),
});


const OrderTrackingProfilePage = () => {
  console.log('OrderTrackingProfilePage loaded');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') || 'track-order';

  // Mock Data
  const activeOrderStatuses = [
    { id: 'placed', name: 'Order Placed', icon: CheckCircle, date: '10:30 AM, Today', completed: true },
    { id: 'confirmed', name: 'Order Confirmed', icon: Package, date: '10:32 AM, Today', completed: true },
    { id: 'preparing', name: 'Preparing Food', icon: UtensilsCrossed, date: '10:35 AM, Today', completed: true },
    { id: 'out_for_delivery', name: 'Out for Delivery', icon: Truck, completed: false },
    { id: 'delivered', name: 'Delivered', icon: CheckCircle, completed: false },
  ];
  const currentStatusId = 'preparing'; // Example active status

  const orderHistory = [
    { id: 'ORD123', date: '2024-07-15', restaurant: 'Luigi\'s Pizza', total: '$25.50', status: 'Delivered' },
    { id: 'ORD124', date: '2024-07-10', restaurant: 'Burger Barn', total: '$15.00', status: 'Delivered' },
    { id: 'ORD125', date: '2024-07-05', restaurant: 'Sakura Sushi', total: '$40.20', status: 'Cancelled' },
  ];

  const userProfile = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+11234567890',
    avatarUrl: 'https://github.com/shadcn.png', // Placeholder avatar
  };
  
  const savedAddresses = [
    { id: 'addr1', label: 'Home', street: '123 Main St', city: 'Anytown', zipCode: '12345' },
    { id: 'addr2', label: 'Work', street: '456 Business Rd', city: 'Anytown', zipCode: '12345' },
  ];

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: userProfile,
  });

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: { label: "", street: "", city: "", zipCode: "" },
  });

  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    console.log("Profile updated:", values);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const onAddressSubmit = (values: z.infer<typeof addressFormSchema>) => {
    console.log("New address added:", values);
    // Add to savedAddresses state here in a real app
    toast({ title: "Address Added", description: `Address "${values.label}" has been saved.` });
    addressForm.reset();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value) => navigate(`?tab=${value}`)}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="track-order" className="flex items-center"><ShoppingBag className="mr-2 h-4 w-4"/>Track Order</TabsTrigger>
              <TabsTrigger value="order-history" className="flex items-center"><ListOrdered className="mr-2 h-4 w-4"/>Order History</TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center"><User className="mr-2 h-4 w-4"/>My Profile</TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center"><MapPin className="mr-2 h-4 w-4"/>Addresses</TabsTrigger>
              {/* Payment Methods tab could be added here */}
            </TabsList>

            {/* Track Order Tab */}
            <TabsContent value="track-order">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Track Your Current Order</CardTitle>
                  <CardDescription>Order #XYZ789 from "Luigi's Pizza Place"</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderTracker 
                    statuses={activeOrderStatuses} 
                    currentStatusId={currentStatusId} 
                    orderNumber="XYZ789"
                    estimatedDelivery="11:15 AM - 11:30 AM"
                  />
                  <div className="mt-6 h-64 bg-gray-200 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">(Placeholder for Live Map View)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Order History Tab */}
            <TabsContent value="order-history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Your Past Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderHistory.map(order => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.restaurant}</TableCell>
                          <TableCell>{order.total}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === 'Delivered' ? 'default' : (order.status === 'Cancelled' ? 'destructive' : 'secondary')}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Manage Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center md:flex-row md:items-start gap-6">
                    <div className="flex flex-col items-center">
                        <Avatar className="h-32 w-32 mb-4 border-2 border-orange-500">
                            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.fullName} />
                            <AvatarFallback>{userProfile.fullName.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm"><Edit3 className="mr-2 h-4 w-4" />Change Photo</Button>
                    </div>
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 flex-grow md:max-w-md">
                            <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={profileForm.control} name="email" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl><Input type="email" placeholder="your.email@example.com" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={profileForm.control} name="phone" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input type="tel" placeholder="+1 123 456 7890" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" className="w-full md:w-auto">Save Changes</Button>
                        </form>
                    </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Addresses Tab */}
            <TabsContent value="addresses">
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Saved Addresses</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {savedAddresses.map(addr => (
                                <Card key={addr.id} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold">{addr.label}</h4>
                                            <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.zipCode}</p>
                                        </div>
                                        <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4"/></Button>
                                    </div>
                                </Card>
                            ))}
                            {savedAddresses.length === 0 && <p className="text-gray-500">No saved addresses yet.</p>}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Add New Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...addressForm}>
                                <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                                    <FormField control={addressForm.control} name="label" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Label (e.g., Home, Work)</FormLabel>
                                        <FormControl><Input placeholder="Home" {...field} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={addressForm.control} name="street" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Street Address</FormLabel>
                                        <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="flex space-x-4">
                                        <FormField control={addressForm.control} name="city" render={({ field }) => (
                                            <FormItem className="flex-grow">
                                            <FormLabel>City</FormLabel>
                                            <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={addressForm.control} name="zipCode" render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>ZIP Code</FormLabel>
                                            <FormControl><Input placeholder="12345" {...field} /></FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <Button type="submit" className="w-full">Add Address</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

          </Tabs>
        </main>
      </ScrollArea>
       <footer className="py-6 bg-gray-800 text-white text-center text-sm mt-auto">
        <p>Manage your FoodFleet experience.</p>
      </footer>
    </div>
  );
};

export default OrderTrackingProfilePage;