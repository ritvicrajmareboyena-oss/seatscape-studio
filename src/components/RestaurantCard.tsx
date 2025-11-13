import { Restaurant } from '@/contexts/BookingContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-elegant animate-fade-in">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute right-4 top-4 bg-background/90 text-foreground backdrop-blur">
            {restaurant.cuisine}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="mb-2 text-xl font-bold text-foreground">{restaurant.name}</h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold text-foreground">{restaurant.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">{restaurant.priceRange}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => navigate(`/restaurant/${restaurant.id}`)}
          className="w-full bg-gradient-primary hover:opacity-90"
        >
          Book a Table
        </Button>
      </CardFooter>
    </Card>
  );
}
