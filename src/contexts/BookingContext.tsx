import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  priceRange: string;
  description: string;
  tables: Table[];
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  isAvailable: boolean;
  pricePerSeat: number;
}

export interface BookingInfo {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  tableId: string;
  tableNumber: number;
  bookingInfo: BookingInfo;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface BookingContextType {
  restaurants: Restaurant[];
  bookings: Booking[];
  currentBooking: {
    restaurant: Restaurant | null;
    table: Table | null;
    bookingInfo: BookingInfo | null;
  };
  setCurrentRestaurant: (restaurant: Restaurant) => void;
  setCurrentTable: (table: Table) => void;
  setBookingInfo: (info: BookingInfo) => void;
  confirmBooking: (paymentMethod: string) => void;
  cancelBooking: (bookingId: string) => void;
  clearCurrentBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [restaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: 'La Bella Italia',
      cuisine: 'Italian',
      rating: 4.8,
      image: '/src/assets/restaurant-1.jpg',
      priceRange: '$$',
      description: 'Authentic Italian cuisine with fresh homemade pasta and wood-fired pizzas.',
      tables: [
        { id: 't1', number: 1, seats: 2, isAvailable: true, pricePerSeat: 25 },
        { id: 't2', number: 2, seats: 4, isAvailable: true, pricePerSeat: 25 },
        { id: 't3', number: 3, seats: 6, isAvailable: false, pricePerSeat: 25 },
        { id: 't4', number: 4, seats: 2, isAvailable: true, pricePerSeat: 25 },
      ],
    },
    {
      id: '2',
      name: 'Sakura Sushi Bar',
      cuisine: 'Japanese',
      rating: 4.9,
      image: '/src/assets/restaurant-2.jpg',
      priceRange: '$$$',
      description: 'Modern Japanese fusion with premium sushi and sashimi selections.',
      tables: [
        { id: 't5', number: 5, seats: 2, isAvailable: true, pricePerSeat: 35 },
        { id: 't6', number: 6, seats: 4, isAvailable: true, pricePerSeat: 35 },
        { id: 't7', number: 7, seats: 8, isAvailable: true, pricePerSeat: 35 },
      ],
    },
    {
      id: '3',
      name: 'Prime Steakhouse',
      cuisine: 'American',
      rating: 4.7,
      image: '/src/assets/restaurant-3.jpg',
      priceRange: '$$$',
      description: 'Premium cuts of beef and classic American steakhouse experience.',
      tables: [
        { id: 't8', number: 8, seats: 2, isAvailable: true, pricePerSeat: 40 },
        { id: 't9', number: 9, seats: 4, isAvailable: false, pricePerSeat: 40 },
        { id: 't10', number: 10, seats: 6, isAvailable: true, pricePerSeat: 40 },
      ],
    },
    {
      id: '4',
      name: 'Le Petit Bistro',
      cuisine: 'French',
      rating: 4.6,
      image: '/src/assets/restaurant-4.jpg',
      priceRange: '$$',
      description: 'Cozy French bistro offering classic dishes and fine wines.',
      tables: [
        { id: 't11', number: 11, seats: 2, isAvailable: true, pricePerSeat: 30 },
        { id: 't12', number: 12, seats: 4, isAvailable: true, pricePerSeat: 30 },
      ],
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<{
    restaurant: Restaurant | null;
    table: Table | null;
    bookingInfo: BookingInfo | null;
  }>({
    restaurant: null,
    table: null,
    bookingInfo: null,
  });

  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const setCurrentRestaurant = (restaurant: Restaurant) => {
    setCurrentBooking(prev => ({ ...prev, restaurant, table: null, bookingInfo: null }));
  };

  const setCurrentTable = (table: Table) => {
    setCurrentBooking(prev => ({ ...prev, table }));
  };

  const setBookingInfo = (info: BookingInfo) => {
    setCurrentBooking(prev => ({ ...prev, bookingInfo: info }));
  };

  const confirmBooking = (paymentMethod: string) => {
    if (!currentBooking.restaurant || !currentBooking.table || !currentBooking.bookingInfo) {
      return;
    }

    const totalAmount = currentBooking.table.pricePerSeat * currentBooking.bookingInfo.guests;
    
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      restaurantId: currentBooking.restaurant.id,
      restaurantName: currentBooking.restaurant.name,
      tableId: currentBooking.table.id,
      tableNumber: currentBooking.table.number,
      bookingInfo: currentBooking.bookingInfo,
      totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    clearCurrentBooking();
  };

  const cancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: 'cancelled' as const } : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const clearCurrentBooking = () => {
    setCurrentBooking({
      restaurant: null,
      table: null,
      bookingInfo: null,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        restaurants,
        bookings,
        currentBooking,
        setCurrentRestaurant,
        setCurrentTable,
        setBookingInfo,
        confirmBooking,
        cancelBooking,
        clearCurrentBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
