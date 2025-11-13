import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '@/contexts/BookingContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, setCurrentRestaurant, setCurrentTable } = useBooking();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-lg text-muted-foreground">Restaurant not found</p>
        </div>
      </div>
    );
  }

  const handleTableSelect = (tableId: string) => {
    const table = restaurant.tables.find((t) => t.id === tableId);
    if (table && table.isAvailable) {
      setSelectedTableId(tableId);
    }
  };

  const handleContinue = () => {
    if (!selectedTableId) {
      toast.error('Please select a table');
      return;
    }

    const selectedTable = restaurant.tables.find((t) => t.id === selectedTableId);
    if (selectedTable) {
      setCurrentRestaurant(restaurant);
      setCurrentTable(selectedTable);
      navigate('/booking-info');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Badge className="mb-4 bg-background/90 text-foreground backdrop-blur">
              {restaurant.cuisine}
            </Badge>
            <h1 className="mb-4 text-5xl font-bold text-white">{restaurant.name}</h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-white" />
                <span className="text-lg font-semibold">{restaurant.rating}</span>
              </div>
              <span className="text-lg">{restaurant.priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold">About</h2>
          <p className="text-lg text-muted-foreground">{restaurant.description}</p>
        </div>

        <div>
          <h2 className="mb-6 text-3xl font-bold">Select Your Table</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {restaurant.tables.map((table) => (
              <Card
                key={table.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTableId === table.id
                    ? 'border-primary shadow-elegant'
                    : table.isAvailable
                    ? 'hover:shadow-card'
                    : 'cursor-not-allowed opacity-50'
                }`}
                onClick={() => handleTableSelect(table.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Table {table.number}</span>
                    {selectedTableId === table.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{table.seats} seats</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      ${table.pricePerSeat}/seat
                    </p>
                    <Badge variant={table.isAvailable ? 'default' : 'secondary'}>
                      {table.isAvailable ? 'Available' : 'Booked'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!selectedTableId}
              size="lg"
              className="bg-gradient-primary px-8"
            >
              Continue to Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
