import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Components
import NavigationMenu from '@/components/layout/NavigationMenu';
import DishCard from '@/components/DishCard'; // Using simplified version or custom display for cart items

// shadcn/ui Components
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

// Icons
import { Trash2, Tag, MapPin, CreditCard, Wallet } from 'lucide-react';

// Mock cart data (replace with actual cart state management)
const initialCartItems = [
  { id: 'p1', name: 'Margherita Pizza (Customized Medium w/ Extra Cheese)', description: 'Classic cheese and tomato pizza.', price: 15.50, imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=100&q=60', quantity: 1 },
  { id: 'd1', name: 'Cola', price: 2.00, quantity: 2 },
];

const deliveryAddresses = [
    { id: 'addr1', label: 'Home - 123 Main St, Anytown', value: '123 Main St, Anytown, USA 12345' },
    { id: 'addr2', label: 'Work - 456 Business Rd, Anytown', value: '456 Business Rd, Anytown, USA 12345' },
];

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  address: z.string().min(5, "Address is required."),
  city: z.string().min(2, "City is required."),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code."),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number."),
  paymentMethod: z.enum(["creditCard", "cod", "paypal"]),
  promoCode: z.string().optional(),
});


const CartCheckoutPage = () => {
  console.log('CartCheckoutPage loaded');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      address: deliveryAddresses[0]?.value || "",
      city: "Anytown",
      zipCode: "12345",
      phone: "+1234567890",
      paymentMethod: "creditCard",
      promoCode: "",
    },
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 5.00; // Example fee
  const total = subtotal + deliveryFee - discount;

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({ title: "Item removed from cart."});
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.10); // 10% discount
      toast({ title: "Promo code applied!", description: "You got a 10% discount."});
    } else {
      setDiscount(0);
      toast({ title: "Invalid promo code.", variant: "destructive"});
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Order placed with values:', values);
    toast({
      title: "Order Placed Successfully!",
      description: "We've received your order and are getting it ready.",
    });
    // Simulate clearing cart and navigating
    setCartItems([]); 
    navigate('/profile?tab=track-order'); // Navigate to order tracking tab
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart & Checkout</h1>
          
          {cartItems.length === 0 ? (
            <Card>
                <CardContent className="p-10 text-center">
                    <p className="text-xl text-gray-600">Your cart is empty.</p>
                    <Button onClick={() => navigate('/restaurants')} className="mt-4">Browse Restaurants</Button>
                </CardContent>
            </Card>
          ) : (
            <div className="lg:flex lg:space-x-8">
              {/* Order Items & Summary - Left Side */}
              <div className="lg:w-2/3 mb-8 lg:mb-0">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center py-4 border-b last:border-b-0">
                        <img src={item.imageUrl || `https://via.placeholder.com/60x60.png?text=${item.name.substring(0,1)}`} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4"/>
                        <div className="flex-grow">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-1"/> Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-xl">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-4 border-t">
                    <Input 
                        type="text" 
                        placeholder="Promo Code" 
                        value={promoCode} 
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-grow"
                    />
                    <Button onClick={handleApplyPromo} variant="outline" className="w-full sm:w-auto">
                        <Tag className="mr-2 h-4 w-4"/> Apply Promo
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Checkout Form - Right Side */}
              <div className="lg:w-1/3">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Delivery & Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Delivery Address */}
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4"/> Delivery Address</FormLabel>
                               <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a delivery address" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {deliveryAddresses.map(addr => (
                                    <SelectItem key={addr.id} value={addr.value}>{addr.label}</SelectItem>
                                  ))}
                                  <SelectItem value="new-address">Enter new address...</SelectItem>
                                </SelectContent>
                              </Select>
                              {field.value === "new-address" && (
                                  <div className="mt-2 space-y-2">
                                    <Input placeholder="Full Name" {...form.register("fullName")} />
                                    <Input placeholder="Street Address" {...form.register("address")} />
                                    <Input placeholder="City" {...form.register("city")} />
                                    <Input placeholder="ZIP Code" {...form.register("zipCode")} />
                                    <Input placeholder="Phone Number" {...form.register("phone")} />
                                  </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Payment Method */}
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center"><CreditCard className="mr-2 h-4 w-4"/> Payment Method</FormLabel>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="creditCard" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Credit/Debit Card</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="cod" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="paypal" />
                                  </FormControl>
                                  <FormLabel className="font-normal">PayPal</FormLabel>
                                </FormItem>
                              </RadioGroup>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         {form.watch("paymentMethod") === "creditCard" && (
                            <div className="space-y-2 p-3 border rounded-md bg-gray-50">
                                <Label>Card Details</Label>
                                <Input placeholder="Card Number (e.g., 1234 ...)" />
                                <div className="flex space-x-2">
                                    <Input placeholder="MM/YY" className="w-1/2"/>
                                    <Input placeholder="CVC" className="w-1/2"/>
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full text-lg py-3 mt-6" size="lg">
                          <Wallet className="mr-2 h-5 w-5"/> Place Order (${total.toFixed(2)})
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </ScrollArea>
      <footer className="py-6 bg-gray-800 text-white text-center text-sm mt-auto">
        <p>Secure Checkout by FoodFleet.</p>
      </footer>
    </div>
  );
};

export default CartCheckoutPage;