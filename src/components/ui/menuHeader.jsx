import { useState } from 'react';
import { User, ShoppingCart, Phone, CreditCard, X } from 'lucide-react';

export default function MenuHeader({ 
  onPersonalize, 
  onViewOrders, 
  onCallStaff, 
  onCheckout,
  cartItems = [],
  totalCalories = 0 
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const handleCallStaff = () => {
    setNotification('Staff has been notified and will assist you shortly.');
    setTimeout(() => setNotification(''), 3000);
    onCallStaff?.();
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
    onCheckout?.();
  };

  const handlePayment = async (method) => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setNotification('Payment successful! Your order has been confirmed.');
      setIsCheckoutOpen(false);
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      setNotification('Payment failed. Please try again.');
    }
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
          
          <nav className="flex items-center gap-2">
            <button
              onClick={onPersonalize}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 transition text-neutral-700 font-medium flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Personalize
            </button>
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 transition text-neutral-700 font-medium flex items-center gap-2 relative"
            >
              <ShoppingCart className="h-4 w-4" />
              View Orders
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              onClick={handleCallStaff}
              className="px-3 py-2 rounded-lg hover:bg-neutral-100 transition text-neutral-700 font-medium flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call Staff
            </button>
            <button
              onClick={handleCheckout}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Checkout
            </button>
          </nav>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Profile Sidebar */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsProfileOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Profile</h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Guest User</h3>
                <p className="text-neutral-600 text-sm">Table 5</p>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Sidebar */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOrdersOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Your Orders</h2>
              <button
                onClick={() => setIsOrdersOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-neutral-600">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                  <p>Your cart is empty</p>
                  <p className="text-sm">Add some delicious dishes to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-neutral-500">IMG</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-neutral-600 text-sm">Qty: {item.quantity}</p>
                        <p className="text-green-600 font-semibold text-sm">${item.price}</p>
                      </div>
                      <button className="text-red-500 hover:text-red-700 transition">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium">
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Sidebar */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsCheckoutOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Checkout</h2>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="text-sm text-neutral-600">
                  <p>Table: 5</p>
                  <p>Order Time: {new Date().toLocaleTimeString()}</p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Order Summary</h3>
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePayment('card')}
                      className="w-full p-3 border rounded-lg hover:bg-neutral-50 transition text-left flex items-center gap-3"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Credit/Debit Card</span>
                    </button>
                    <button
                      onClick={() => handlePayment('cash')}
                      className="w-full p-3 border rounded-lg hover:bg-neutral-50 transition text-left flex items-center gap-3"
                    >
                      <span className="text-lg">💵</span>
                      <span>Cash</span>
                    </button>
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

