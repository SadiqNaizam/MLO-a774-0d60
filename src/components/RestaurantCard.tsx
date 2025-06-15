import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisine: string | string[]; // Can be single or multiple
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "20-30 min"
  onClick?: (id: string | number) => void;
  priceRange?: '$' | '$$' | '$$$' | '$$$$'; // Optional
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisine,
  rating,
  deliveryTime,
  onClick,
  priceRange,
}) => {
  console.log("Rendering RestaurantCard:", name);
  const cuisines = Array.isArray(cuisine) ? cuisine.join(', ') : cuisine;

  const handleClick = () => {
    if (onClick) {
      console.log("RestaurantCard clicked:", id);
      onClick(id);
    }
  };

  return (
    <Card
      className={`overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ${onClick ? 'cursor-pointer' : ''} flex flex-col h-full`}
      onClick={handleClick}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && handleClick() : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`View restaurant: ${name}`}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2 flex-grow">
        <CardTitle className="text-lg font-semibold truncate" title={name}>{name}</CardTitle>
        <p className="text-xs text-gray-600 truncate" title={cuisines}>{cuisines}</p>
        <div className="flex items-center justify-between text-xs text-gray-700 pt-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span>{deliveryTime}</span>
          </div>
          {priceRange && <span className="font-medium">{priceRange}</span>}
        </div>
      </CardContent>
      {/* Footer can be used for promotions or quick actions if needed */}
      {/* <CardFooter className="p-4 pt-0">
         <Badge variant="destructive">20% OFF</Badge>
      </CardFooter> */}
    </Card>
  );
};
export default RestaurantCard;