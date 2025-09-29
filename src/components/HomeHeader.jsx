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
      // console.log('Menu data:', menuData);
    } catch (error) {
      // console.error('Failed to fetch menu:', error);
    }
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
    fetchMenuData();
  };

  return (
    <>
      <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 animate-slide-in-top">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 hover:scale-105 transition-all duration-300 group animate-fadeIn"
            aria-label="Reload page"
          >
            <span className="inline-block h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white grid place-items-center font-bold text-xl shadow-lg group-hover:shadow-xl group-hover:animate-heartbeat transition-all duration-300">R</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Restaurant</span>
          </button>
          
          <nav className="flex items-center gap-2 animate-fadeIn stagger-1">
            <button
              onClick={() => setIsAboutOpen(true)}
              className="px-6 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 text-neutral-700 font-medium hover:text-orange-600 hover:scale-105 hover:shadow-md btn-animated"
            >
              About Us
            </button>
            <button
              onClick={() => setIsReservationOpen(true)}
              className="px-6 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 text-neutral-700 font-medium hover:text-orange-600 hover:scale-105 hover:shadow-md btn-animated"
            >
              Reservation
            </button>
            <button
              onClick={handleMenuClick}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg btn-animated"
            >
              Menu
            </button>
          </nav>
        </div>
      </header>

      {/* About Us Sidebar */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex animate-slide-in-top">
          <div className="fixed inset-0 bg-black/50 animate-fadeIn" onClick={() => setIsAboutOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">About Us</h2>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="p-2 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <X className="h-5 w-5 text-neutral-600 hover:text-red-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4 animate-fadeIn">
                <p className="text-neutral-600 leading-relaxed">
                  Welcome to our restaurant, where culinary excellence meets warm hospitality. 
                  We've been serving exceptional dishes made with the finest ingredients for over a decade.
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  Our talented chefs create innovative menus that blend traditional techniques with 
                  modern flavors, ensuring every meal is a memorable experience.
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  We pride ourselves on providing exceptional service in a comfortable, elegant atmosphere 
                  that's perfect for any occasion - from intimate dinners to large celebrations.
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">Our Mission</h3>
                <p className="text-orange-700 text-sm">
                  Creating unforgettable dining experiences through exceptional food, outstanding service, and warm hospitality.
                </p>
              </div>
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
                  Giờ tới ăn: {reservationData.time}
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="time"
                    value={reservationData.time}
                    onChange={(e) => setReservationData({...reservationData, time: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="11:00"
                    max="22:00"
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
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg btn-animated"
              >
                Book Table
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menu Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex animate-slide-in-top">
          <div className="fixed inset-0 bg-black/50 animate-fadeIn" onClick={() => setIsMenuOpen(false)} />
          <div className="relative ml-auto w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Our Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-lg transition-all duration-300 hover:scale-110"
              >
                <X className="h-5 w-5 text-neutral-600 hover:text-red-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 mb-6 border border-blue-200">
                <p className="text-blue-800 font-medium">
                  🍽️ Browse our delicious menu! To place orders, please visit our restaurant and scan the QR code at your table.
                </p>
              </div>
              <div className="space-y-6">
                <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🔥</span>
                    </div>
                    <h3 className="font-bold text-lg text-neutral-900">Best Sellers</h3>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <span>Loading best selling dishes...</span>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">💰</span>
                    </div>
                    <h3 className="font-bold text-lg text-neutral-900">Good Deals</h3>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <span>Loading special offers...</span>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 card-hover animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">⭐</span>
                    </div>
                    <h3 className="font-bold text-lg text-neutral-900">Sale of the Month</h3>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <span>Loading monthly specials...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

