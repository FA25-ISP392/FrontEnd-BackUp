import { useState } from 'react';
import { Menu, X, Phone, Calendar, Users, Clock } from 'lucide-react';

export default function HomeHeader() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reservationData, setReservationData] = useState({
    phone: '',
    name: '',
    time: '18:00',
    date: '',
    guests: 2
  });
  const [notification, setNotification] = useState('');

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!reservationData.phone || !reservationData.name || !reservationData.date) {
      setNotification('Please fill in all required fields');
      return;
    }

    if (reservationData.guests < 1 || reservationData.guests > 12) {
      setNotification('Number of guests must be between 1 and 12');
      return;
    }

    try {
      // Simulate API call
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
      });
      
      if (response.ok) {
        setNotification('Reservation confirmed! We will contact you soon.');
        setReservationData({ phone: '', name: '', time: '18:00', date: '', guests: 2 });
      } else {
        setNotification('Sorry, all tables are fully reserved for this time slot.');
      }
    } catch (error) {
      setNotification('Booking system is currently unavailable. Please call us directly.');
    }
  };

  const fetchMenuData = async () => {
    try {
      const response = await fetch('/api/menu');
      const menuData = await response.json();
      console.log('Menu data:', menuData);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
    fetchMenuData();
  };

  return (
    <>
      <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 hover:opacity-80 transition"
            aria-label="Reload page"
          >
            <span className="inline-block h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold">R</span>
            <span className="text-lg font-semibold">Restaurant</span>
          </button>
          
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="px-4 py-2 rounded-lg hover:bg-neutral-100 transition text-neutral-700 font-medium"
            >
              About Us
            </button>
            <button
              onClick={() => setIsReservationOpen(true)}
              className="px-4 py-2 rounded-lg hover:bg-neutral-100 transition text-neutral-700 font-medium"
            >
              Reservation
            </button>
            <button
              onClick={handleMenuClick}
              className="px-4 py-2 rounded-lg hover:bg-neutral-100 transition text-neutral-700 font-medium"
            >
              Menu
            </button>
          </nav>
        </div>
      </header>

      {/* About Us Sidebar */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsAboutOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">About Us</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-neutral-600">
                Welcome to our restaurant, where culinary excellence meets warm hospitality. 
                We've been serving exceptional dishes made with the finest ingredients for over a decade.
              </p>
              <p className="text-neutral-600">
                Our talented chefs create innovative menus that blend traditional techniques with 
                modern flavors, ensuring every meal is a memorable experience.
              </p>
              <p className="text-neutral-600">
                We pride ourselves on providing exceptional service in a comfortable, elegant atmosphere 
                that's perfect for any occasion - from intimate dinners to large celebrations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Sidebar */}
      {isReservationOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsReservationOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Table Reservation</h2>
              <button
                onClick={() => setIsReservationOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleReservationSubmit} className="p-4 space-y-4">
              {notification && (
                <div className={`p-3 rounded-lg text-sm ${
                  notification.includes('confirmed') || notification.includes('contact')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {notification}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="tel"
                    value={reservationData.phone}
                    onChange={(e) => setReservationData({...reservationData, phone: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={reservationData.name}
                  onChange={(e) => setReservationData({...reservationData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="date"
                    value={reservationData.date}
                    onChange={(e) => setReservationData({...reservationData, date: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Time: {reservationData.time}
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="range"
                    min="11:00"
                    max="22:00"
                    step="30"
                    value={reservationData.time}
                    onChange={(e) => setReservationData({...reservationData, time: e.target.value})}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Number of Guests: {reservationData.guests}
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={reservationData.guests}
                    onChange={(e) => setReservationData({...reservationData, guests: parseInt(e.target.value)})}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Book Table
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menu Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="relative ml-auto w-full max-w-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Our Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-neutral-600 mb-4">
                Browse our delicious menu. To place orders, please visit our restaurant and scan the QR code at your table.
              </p>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Best Sellers</h3>
                  <p className="text-neutral-600">Loading best selling dishes...</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Good Deals</h3>
                  <p className="text-neutral-600">Loading special offers...</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Sale of the Month</h3>
                  <p className="text-neutral-600">Loading monthly specials...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

