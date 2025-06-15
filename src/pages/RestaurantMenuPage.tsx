import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Custom Components
import NavigationMenu from '@/components/layout/NavigationMenu';
import DishCard from '@/components/DishCard';

// shadcn/ui Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"


// Icons
import { Star, Clock, ShoppingCart, Utensils, Flame, Leaf, PlusCircle } from 'lucide-react';

// Mock Data (replace with actual data fetching)
const mockRestaurantsData: any = {
  '1': {
    name: 'Luigi\'s Pizza Place',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/1384/1384672.png', // Placeholder chef icon
    rating: 4.5,
    deliveryTime: '25-35 min',
    cuisine: 'Italian, Pizza',
    menu: {
      appetizers: [
        { id: 'a1', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs.', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1627308594095-a7c50c246315?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
        { id: 'a2', name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil.', price: 7.50, imageUrl: 'https://images.unsplash.com/photo-1579204640038-6c97b0846055?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FwcmVzZSUyMHNhbGFkfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60' },
      ],
      pizzas: [
        { id: 'p1', name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza.', price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', customization: { size: ['Medium', 'Large'], toppings: ['Extra Cheese', 'Olives'] } },
        { id: 'p2', name: 'Pepperoni Pizza', description: 'Pizza topped with spicy pepperoni.', price: 14.50, imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
        { id: 'p3', name: 'Veggie Supreme', description: 'Loaded with fresh vegetables.', price: 13.75, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmVnZ2llJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', customization: { size: ['Medium', 'Large'] } },
      ],
      drinks: [
        { id: 'd1', name: 'Cola', price: 2.00 },
        { id: 'd2', name: 'Lemonade', price: 2.50 },
      ]
    }
  },
  // Add more restaurants if needed
};

interface Dish {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  customization?: {
    size?: string[];
    toppings?: string[];
  };
}

const RestaurantMenuPage = () => {
  console.log('RestaurantMenuPage loaded');
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cart, setCart] = useState<Dish[]>([]);
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [customizationOptions, setCustomizationOptions] = useState<{size?: string, toppings?: string[]}>({});


  // In a real app, fetch restaurant data based on restaurantId
  const restaurant = restaurantId ? mockRestaurantsData[restaurantId] : null;

  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationMenu />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Restaurant not found.</p>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = (dishId: string | number) => {
    const categoryKey = Object.keys(restaurant.menu).find(key => restaurant.menu[key].find((d: Dish) => d.id === dishId));
    if (!categoryKey) return;
    
    const dishToAdd = restaurant.menu[categoryKey].find((d: Dish) => d.id === dishId);
    if (dishToAdd) {
      setCart(prevCart => [...prevCart, dishToAdd]);
      toast({
        title: `${dishToAdd.name} added to cart!`,
        description: `Price: $${dishToAdd.price.toFixed(2)}`,
        action: <Button variant="outline" size="sm" onClick={() => navigate('/cart')}>View Cart</Button>,
      });
      console.log('Added to cart:', dishToAdd);
    }
  };

  const handleCustomizeDish = (dishId: string | number) => {
    const categoryKey = Object.keys(restaurant.menu).find(key => restaurant.menu[key].find((d: Dish) => d.id === dishId));
    if (!categoryKey) return;

    const dishToCustomize = restaurant.menu[categoryKey].find((d: Dish) => d.id === dishId);
    if (dishToCustomize && dishToCustomize.customization) {
      setSelectedDish(dishToCustomize);
      // Initialize customization options
      setCustomizationOptions({
        size: dishToCustomize.customization.size?.[0], // Default to first size
        toppings: [] // No toppings selected by default
      });
      setIsCustomizationDialogOpen(true);
      console.log('Customizing dish:', dishToCustomize);
    } else if (dishToCustomize) { // If no customization, just add to cart
        handleAddToCart(dishId);
    }
  };
  
  const handleFinalizeCustomization = () => {
    if (selectedDish) {
        // Here you would typically create a new "customized" dish object
        // For simplicity, we'll just add the base dish with a note about customization
        const customizedDish = {
            ...selectedDish,
            name: `${selectedDish.name} (Customized ${customizationOptions.size ? customizationOptions.size : ''} ${customizationOptions.toppings && customizationOptions.toppings.length > 0 ? `w/ ${customizationOptions.toppings.join(', ')}` : ''})`,
            // Price could be adjusted based on options
        };
        setCart(prevCart => [...prevCart, customizedDish]);
        toast({
          title: `${customizedDish.name} added to cart!`,
          description: `Customized options applied.`,
          action: <Button variant="outline" size="sm" onClick={() => navigate('/cart')}>View Cart</Button>,
        });
        console.log('Finalized customization and added to cart:', customizedDish, customizationOptions);
        setIsCustomizationDialogOpen(false);
        setSelectedDish(null);
    }
  };

  const menuCategories = Object.keys(restaurant.menu);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={cart.length} />

      {/* Restaurant Header */}
      <header className="bg-white shadow-sm p-6 sticky top-16 z-30"> {/* sticky below nav */}
        <div className="container mx-auto flex items-center space-x-4">
          <Avatar className="h-20 w-20 border">
            <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
            <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
            <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
            <div className="flex items-center space-x-3 mt-1">
              <Badge variant="default"><Star className="h-3 w-3 mr-1" /> {restaurant.rating}</Badge>
              <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> {restaurant.deliveryTime}</Badge>
            </div>
          </div>
          <Button className="ml-auto" onClick={() => navigate('/cart')}>
            <ShoppingCart className="mr-2 h-5 w-5" /> View Cart ({cart.length})
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
         <Tabs defaultValue={menuCategories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-none md:flex mb-6 overflow-x-auto">
            {menuCategories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize flex items-center">
                {category === 'pizzas' && <Flame className="mr-2 h-4 w-4" />}
                {category === 'appetizers' && <Utensils className="mr-2 h-4 w-4" />}
                {category === 'drinks' && <Leaf className="mr-2 h-4 w-4" />}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {menuCategories.map(category => (
            <TabsContent key={category} value={category}>
              <Accordion type="single" collapsible className="w-full" defaultValue='item-1'>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-2xl font-semibold capitalize">{category}</AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-auto max-h-[calc(100vh-300px)]"> {/* Adjust height as needed */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                                {restaurant.menu[category].map((dish: Dish) => (
                                <DishCard
                                    key={dish.id}
                                    {...dish}
                                    onAddToCart={() => handleAddToCart(dish.id)}
                                    onCustomize={dish.customization ? () => handleCustomizeDish(dish.id) : undefined}
                                />
                                ))}
                            </div>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Customization Dialog */}
      {selectedDish && selectedDish.customization && (
        <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customize {selectedDish.name}</DialogTitle>
              <DialogDescription>
                Make selections for your {selectedDish.name}. Price may vary.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedDish.customization.size && (
                <div>
                  <Label htmlFor="size" className="text-right mb-2 block font-medium">Size</Label>
                  <RadioGroup 
                    defaultValue={selectedDish.customization.size[0]} 
                    id="size"
                    onValueChange={(value) => setCustomizationOptions(prev => ({...prev, size: value}))}
                  >
                    {selectedDish.customization.size.map(s => (
                       <div key={s} className="flex items-center space-x-2">
                         <RadioGroupItem value={s} id={`size-${s}`} />
                         <Label htmlFor={`size-${s}`}>{s}</Label>
                       </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              {selectedDish.customization.toppings && (
                 <div>
                  <Label className="text-right mb-2 block font-medium">Extra Toppings</Label>
                  {selectedDish.customization.toppings.map(topping => (
                    <div key={topping} className="flex items-center space-x-2 mb-1">
                        <Checkbox 
                            id={`topping-${topping}`} 
                            onCheckedChange={(checked) => {
                                setCustomizationOptions(prev => ({
                                    ...prev,
                                    toppings: checked 
                                        ? [...(prev.toppings || []), topping] 
                                        : (prev.toppings || []).filter(t => t !== topping)
                                }))
                            }}
                        />
                        <Label htmlFor={`topping-${topping}`} className="font-normal">{topping}</Label>
                    </div>
                  ))}
                 </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCustomizationDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleFinalizeCustomization}><PlusCircle className="mr-2 h-4 w-4"/>Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <footer className="py-6 bg-gray-800 text-white text-center text-sm mt-auto">
        <p>Enjoy your meal from {restaurant.name}!</p>
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;