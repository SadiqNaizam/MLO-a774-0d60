import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { PlusCircle, Edit } from 'lucide-react'; // PlusCircle for add, Edit for customize

interface DishCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (id: string | number) => void;
  onCustomize?: (id: string | number) => void; // Optional: for dishes with options
  currencySymbol?: string;
}

const DishCard: React.FC<DishCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  onCustomize,
  currencySymbol = '$',
}) => {
  console.log("Rendering DishCard:", name);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if button is clicked
    console.log("Add to cart clicked for dish:", id);
    onAddToCart(id);
  };

  const handleCustomize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCustomize) {
        console.log("Customize clicked for dish:", id);
        onCustomize(id);
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {imageUrl && (
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
      )}
      <CardContent className={`p-4 space-y-1 flex-grow ${!imageUrl ? 'pt-6' : ''}`}>
        <CardTitle className="text-md font-semibold">{name}</CardTitle>
        {description && <p className="text-xs text-gray-600 line-clamp-2">{description}</p>}
      </CardContent>
      <CardFooter className="p-3 pt-2 flex items-center justify-between">
        <span className="text-md font-bold text-orange-600">
          {currencySymbol}{price.toFixed(2)}
        </span>
        {onCustomize ? (
          <Button size="sm" variant="outline" onClick={handleCustomize} aria-label={`Customize ${name}`}>
            <Edit className="mr-1 h-4 w-4" /> Customize
          </Button>
        ) : (
          <Button size="sm" onClick={handleAddToCart} aria-label={`Add ${name} to cart`} className="bg-green-500 hover:bg-green-600">
            <PlusCircle className="mr-1 h-4 w-4" /> Add
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default DishCard;