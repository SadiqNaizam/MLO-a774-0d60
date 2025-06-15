import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

interface LocationSearchBarProps {
  onSearch: (location: string) => void;
  onUseCurrentLocation?: () => void; // Optional: if geolocation is implemented
  initialValue?: string;
  placeholder?: string;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  onSearch,
  onUseCurrentLocation,
  initialValue = '',
  placeholder = "Enter your delivery address",
}) => {
  const [location, setLocation] = useState(initialValue);
  console.log("Rendering LocationSearchBar, current location input:", location);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      console.log("Location search submitted:", location);
      onSearch(location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 p-4 bg-gray-50 rounded-lg shadow">
      <div className="relative flex-grow w-full sm:w-auto">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-2 py-2 w-full"
          aria-label="Location search input"
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button type="submit" className="w-full sm:w-auto flex-grow sm:flex-grow-0 bg-orange-500 hover:bg-orange-600">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
        {onUseCurrentLocation && (
          <Button
            type="button"
            variant="outline"
            onClick={onUseCurrentLocation}
            className="w-full sm:w-auto flex-grow sm:flex-grow-0"
            aria-label="Use my current location"
          >
            <MapPin className="mr-2 h-4 w-4" /> Current
          </Button>
        )}
      </div>
    </form>
  );
};
export default LocationSearchBar;