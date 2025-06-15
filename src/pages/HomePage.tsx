import React from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Components
import NavigationMenu from '@/components/layout/NavigationMenu';
import LocationSearchBar from '@/components/LocationSearchBar';
import Carousel from '@/components/Carousel';
import CuisineCarouselItem from '@/components/CuisineCarouselItem';
import RestaurantCard from '@/components/RestaurantCard';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Assets / Icons
import { Utensils } from 'lucide-react';

const placeholderCuisines = [
  { name: 'Pizza', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { name: 'Burgers', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
  { name: 'Sushi', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { name: 'Italian', imageUrl: 'https://images.unsplash.com/photo-1533777324565-604084c5cF46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aXRhbGlhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { name: 'Mexican', imageUrl: 'https://images.unsplash.com/photo-1565299585323-BA4d69909068?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWV4aWNhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
  { name: 'Chinese', imageUrl: 'https://images.unsplash.com/photo-1585851374394-df70021201c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpbmVzZSUyMGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
];

const placeholderRestaurants = [
  { id: '1', name: 'Luigi\'s Pizza Place', imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBpenphJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'Italian, Pizza', rating: 4.5, deliveryTime: '25-35 min', priceRange: '$$' },
  { id: '2', name: 'Burger Barn', imageUrl: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVyZ2VyJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisine: 'American, Burgers', rating: 4.2, deliveryTime: '20-30 min', priceRange: '$' },
  { id: '3', name: 'Sakura Sushi', imageUrl: 'https://images.unsplash.com/photo-1611141643090-a331320c3501?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisine: 'Japanese, Sushi', rating: 4.8, deliveryTime: '30-40 min', priceRange: '$$$' },
  { id: '4', name: 'The Noodle House', imageUrl: 'https://images.unsplash.com/photo-1555126634-789b782b3f0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXNpYW4lMjByZXN0YXVyYW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisine: 'Asian, Noodles', rating: 4.3, deliveryTime: '20-30 min', priceRange: '$$' },
];

const promotionalSlides = [
    <img key="promo1" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMGRlbGl2ZXJ5JTIwYmFubmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=1000&q=80" alt="Food Promotion 1" className="w-full h-64 object-cover rounded-lg" />,
    <img key="promo2" src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZCUyMGRlbGl2ZXJ5JTIwYmFubmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=1000&q=80" alt="Food Promotion 2" className="w-full h-64 object-cover rounded-lg" />,
    <img key="promo3" src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZvb2QlMjBkZWxpdmVyeSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Food Promotion 3" className="w-full h-64 object-cover rounded-lg" />
];

const HomePage = () => {
  console.log('HomePage loaded');
  const navigate = useNavigate();

  const handleLocationSearch = (location: string) => {
    console.log('Searching for location:', location);
    navigate(`/restaurants?location=${encodeURIComponent(location)}`);
  };

  const handleCuisineClick = (cuisineName: string) => {
    console.log('Cuisine clicked:', cuisineName);
    navigate(`/restaurants?cuisine=${encodeURIComponent(cuisineName)}`);
  };

  const handleRestaurantClick = (restaurantId: string | number) => {
    console.log('Restaurant clicked:', restaurantId);
    navigate(`/restaurant/${restaurantId}/menu`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu cartItemCount={3} /> {/* Example cart item count */}
      
      <main className="flex-grow">
        {/* Hero Section with Location Search */}
        <section className="py-8 px-4 md:px-8 bg-white shadow-sm">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
              Delicious food, delivered to you.
            </h1>
            <p className="text-md text-gray-600 text-center mb-6">
              Enter your address to find amazing restaurants near you.
            </p>
            <LocationSearchBar onSearch={handleLocationSearch} placeholder="Enter your delivery address" />
          </div>
        </section>

        {/* Promotional Carousel */}
        <section className="py-8 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Utensils className="mr-2 h-6 w-6 text-orange-500" /> Today's Offers
                </h2>
                <Carousel slides={promotionalSlides} showArrows={true} />
            </div>
        </section>

        {/* Cuisine Carousel */}
        <section className="py-8 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What's on your mind?</h2>
            <Carousel
              slides={placeholderCuisines.map(cuisine => (
                <CuisineCarouselItem
                  key={cuisine.name}
                  name={cuisine.name}
                  imageUrl={cuisine.imageUrl}
                  onClick={() => handleCuisineClick(cuisine.name)}
                />
              ))}
              options={{ slidesToScroll: 'auto', containScroll: 'trimSnaps' }}
              showArrows={true}
            />
          </div>
        </section>

        {/* Featured Restaurants Section */}
        <section className="py-8 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Restaurants Near You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {placeholderRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  {...restaurant}
                  onClick={() => handleRestaurantClick(restaurant.id)}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" onClick={() => navigate('/restaurants')}>
                View All Restaurants
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-gray-800 text-white text-center">
        <p>&copy; {new Date().getFullYear()} FoodFleet. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;