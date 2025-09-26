import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold">R</span>
              <span className="text-lg font-semibold">Restaurant</span>
            </div>
            <p className="text-neutral-600 text-sm mb-4">
              Fine dining, modern comfort, exceptional service. Experience culinary excellence in a warm, elegant atmosphere.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@restaurant.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Main Street, City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Hours</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Mon-Thu: 11AM-10PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Fri-Sat: 11AM-11PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Sunday: 12PM-9PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-neutral-600 hover:text-neutral-900 transition">About Us</a>
              <a href="#" className="block text-neutral-600 hover:text-neutral-900 transition">Reservations</a>
              <a href="#" className="block text-neutral-600 hover:text-neutral-900 transition">Menu</a>
              <a href="#" className="block text-neutral-600 hover:text-neutral-900 transition">Contact</a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-sm text-neutral-600 flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} Restaurant. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-900 transition">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-900 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
 