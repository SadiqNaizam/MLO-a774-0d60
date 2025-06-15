import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Custom Components
import NavigationMenu from '@/components/layout/NavigationMenu';
import RestaurantCard from '@/components/RestaurantCard';

// shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Icons
import { Search, Filter, Star, Clock, DollarSign, ArrowUpDown } from 'lucide-react';

const initialRestaurants = [
  { id: '1', name: 'Luigi\'s Pizza Place', imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBpenphJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Italian, Pizza', rating: 4.5, deliveryTime: '25-35 min', priceRange: '$$' },
  { id: '2', name: 'Burger Barn', imageUrl: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVyZ2VyJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'American, Burgers', rating: 4.2, deliveryTime: '20-30 min', priceRange: '$' },
  { id: '3', name: 'Sakura Sushi', imageUrl: 'https://images.unsplash.com/photo-1611141643090-a331320c3501?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisine: 'Japanese, Sushi', rating: 4.8, deliveryTime: '30-40 min', priceRange: '$$$' },
  { id: '4', name: 'The Noodle House', imageUrl: 'https://images.unsplash.com/photo-1555126634-789b782b3f0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXNpYW4lMjByZXN0YXVyYW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisine: 'Asian, Noodles', rating: 4.3, deliveryTime: '20-30 min', priceRange: '$$' },
  { id: '5', name: 'Taco Town', imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFjbyUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Mexican', rating: 4.0, deliveryTime: '15-25 min', priceRange: '$' },
  { id: '6', name: 'Curry Corner', imageUrl: 'https://images.unsplash.com/photo-1567608285963-818ab9099050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Indian', rating: 4.6, deliveryTime: '35-45 min', priceRange: '$$' },
];

const cuisineOptions = ['Italian', 'American', 'Japanese', 'Asian', 'Mexican', 'Indian', 'Chinese', 'Thai'];
const priceRangeOptions = [
    { label: 'Any', value: 'any'},
    { label: '$ (Affordable)', value: '$'},
    { label: '$$ (Moderate)', value: '$$'},
    { label: '$$$ (Pricey)', value: '$$$'},
];

const RestaurantListingPage = () => {
  console.log('RestaurantListingPage loaded');
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'deliveryTime', 'name'
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [showOpenNow, setShowOpenNow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<typeof initialRestaurants>([]);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    const params = new URLSearchParams(location.search);
    const queryCuisine = params.get('cuisine');
    if(queryCuisine && !selectedCuisines.includes(queryCuisine)) {
        setSelectedCuisines(prev => [...prev, queryCuisine]);
    }
    
    setTimeout(() => {
      // Basic filtering simulation - in a real app, this would be backend logic
      let filtered = initialRestaurants;
      if (searchTerm) {
        filtered = filtered.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.cuisine.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      if (selectedCuisines.length > 0) {
        filtered = filtered.filter(r => selectedCuisines.some(c => r.cuisine.includes(c)));
      }
      if (selectedPriceRanges.length > 0 && !selectedPriceRanges.includes('any')) {
        filtered = filtered.filter(r => r.priceRange && selectedPriceRanges.includes(r.priceRange));
      }
      
      // Sorting
      if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      else if (sortBy === 'deliveryTime') filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
      else if (sortBy === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));

      setRestaurants(filtered);
      setIsLoading(false);
    }, 1000);
  }, [searchTerm, sortBy, selectedCuisines, selectedPriceRanges, showOpenNow, location.search]);

  const handleRestaurantClick = (restaurantId: string | number) => {
    navigate(`/restaurant/${restaurantId}/menu`);
  };

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };
  
  const handlePriceRangeToggle = (price: string) => {
    if (price === 'any') {
        setSelectedPriceRanges(['any']);
    } else {
        setSelectedPriceRanges(prev => {
            const newSelection = prev.filter(p => p !== 'any'); // remove 'any' if specific price is selected
            return newSelection.includes(price) ? newSelection.filter(p => p !== price) : [...newSelection, price];
        });
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu />
      <div className="container mx-auto px-4 py-6 flex-grow">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Find Your Next Meal</h1>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search restaurants or cuisines..." 
              className="pl-10 text-base py-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="lg:flex lg:space-x-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-1/4 mb-6 lg:mb-0">
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center"><Filter className="mr-2 h-5 w-5" /> Filters</h2>
              <Separator className="my-4" />
              
              <div>
                <Label className="text-md font-medium">Sort by</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating"><Star className="inline mr-2 h-4 w-4"/>Rating</SelectItem>
                    <SelectItem value="deliveryTime"><Clock className="inline mr-2 h-4 w-4"/>Delivery Time</SelectItem>
                    <SelectItem value="name"><ArrowUpDown className="inline mr-2 h-4 w-4"/>Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-4" />
              <div>
                <Label className="text-md font-medium">Cuisine</Label>
                 <ScrollArea className="h-40 mt-1">
                    {cuisineOptions.map(cuisine => (
                        <div key={cuisine} className="flex items-center space-x-2 mt-2">
                            <Checkbox 
                                id={`cuisine-${cuisine}`} 
                                checked={selectedCuisines.includes(cuisine)}
                                onCheckedChange={() => handleCuisineToggle(cuisine)}
                            />
                            <Label htmlFor={`cuisine-${cuisine}`} className="font-normal">{cuisine}</Label>
                        </div>
                    ))}
                 </ScrollArea>
              </div>

              <Separator className="my-4" />
              <div>
                 <Label className="text-md font-medium">Price Range</Label>
                 <ToggleGroup 
                    type="multiple" 
                    variant="outline" 
                    className="mt-2 flex-wrap justify-start"
                    value={selectedPriceRanges}
                    onValueChange={setSelectedPriceRanges} // This might need adjustment if ToggleGroupItem values are used directly
                 >
                    {priceRangeOptions.map(opt => (
                        <ToggleGroupItem 
                            key={opt.value} 
                            value={opt.value} 
                            aria-label={opt.label}
                            onClick={() => handlePriceRangeToggle(opt.value)} // Direct click handler
                            className="mr-1 mb-1"
                            data-state={selectedPriceRanges.includes(opt.value) ? 'on' : 'off'}
                        >
                            {opt.value === 'any' ? 'Any' : opt.value}
                        </ToggleGroupItem>
                    ))}
                 </ToggleGroup>
              </div>

              <Separator className="my-4" />
              <div className="flex items-center space-x-2">
                <Checkbox id="open-now" checked={showOpenNow} onCheckedChange={(checked) => setShowOpenNow(Boolean(checked))} />
                <Label htmlFor="open-now" className="font-normal">Open Now</Label>
              </div>
            </div>
          </aside>

          {/* Restaurant List */}
          <main className="w-full lg:w-3/4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">{restaurants.length} Restaurants Found</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-4 space-y-3">
                    <Skeleton className="h-40 w-full rounded" />
                    <Skeleton className="h-6 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4 rounded" />
                      <Skeleton className="h-4 w-1/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : restaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {restaurants.map(restaurant => (
                  <RestaurantCard
                    key={restaurant.id}
                    {...restaurant}
                    onClick={() => handleRestaurantClick(restaurant.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xl text-gray-600">No restaurants match your criteria.</p>
                <p className="text-gray-500">Try adjusting your filters or search term.</p>
              </div>
            )}
            {/* Pagination or Load More Button could go here */}
            {!isLoading && restaurants.length > 5 && (
                 <div className="mt-8 text-center">
                    <Button variant="outline">Load More</Button>
                 </div>
            )}
          </main>
        </div>
      </div>
      <footer className="py-6 bg-gray-800 text-white text-center text-sm">
        <p>&copy; {new Date().getFullYear()} FoodFleet. Your choice for delicious food.</p>
      </footer>
    </div>
  );
};

export default RestaurantListingPage;