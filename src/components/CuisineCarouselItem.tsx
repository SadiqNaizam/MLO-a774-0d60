import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CuisineCarouselItemProps {
  name: string;
  imageUrl: string;
  onClick?: (name: string) => void;
}

const CuisineCarouselItem: React.FC<CuisineCarouselItemProps> = ({ name, imageUrl, onClick }) => {
  console.log("Rendering CuisineCarouselItem:", name);
  const handleClick = () => {
    if (onClick) {
      console.log("Cuisine item clicked:", name);
      onClick(name);
    }
  };

  return (
    <Card
      className={`overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 ${onClick ? 'cursor-pointer' : ''} h-full flex flex-col`}
      onClick={handleClick}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && handleClick() : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`Cuisine type: ${name}`}
    >
      <AspectRatio ratio={16 / 9}>
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={name}
          className="object-cover w-full h-full"
          onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
        />
      </AspectRatio>
      <CardContent className="p-3 flex-grow flex items-center justify-center">
        <h3 className="text-sm font-semibold text-center text-gray-800">{name}</h3>
      </CardContent>
    </Card>
  );
};
export default CuisineCarouselItem;