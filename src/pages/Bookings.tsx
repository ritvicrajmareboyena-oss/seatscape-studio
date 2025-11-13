import { useBooking } from '@/contexts/BookingContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Bookings() {
  const { bookings, cancelBooking } = useBooking();

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold">My Bookings</h1>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                You don't have any bookings yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {bookings.map((booking) => (
              <Card key={booking.id} className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{booking.restaurantName}</CardTitle>
                    <Badge
                      variant={
                        booking.status === 'confirmed'
                          ? 'default'
                          : booking.status === 'cancelled'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Table {booking.tableNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.bookingInfo.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.bookingInfo.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.bookingInfo.guests} guests</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="mb-3 flex justify-between">
                      <span className="font-semibold">Total Amount</span>
                      <span className="text-lg font-bold text-primary">
                        ${booking.totalAmount}
                      </span>
                    </div>

                    {booking.status === 'confirmed' && (
                      <Button
                        onClick={() => handleCancelBooking(booking.id)}
                        variant="destructive"
                        className="w-full"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
