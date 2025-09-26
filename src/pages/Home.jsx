import { useState, useEffect } from 'react';
import { Star, Clock, Users, Award, MapPin, Phone, Mail, ArrowRight, ChefHat, Heart, Zap, Play, Globe, Leaf, Smile, BookOpen, Calendar, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [goodDeals, setGoodDeals] = useState([]);
  const [saleOfMonth, setSaleOfMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        // Mock data inspired by Pizza 4P's
        setBestSellers([
          { id: 1, name: 'Burrata Parma Ham Margherita', price: 28.99, image: '/api/placeholder/400/300', description: 'Fresh burrata cheese with premium Parma ham and basil', category: 'Pizza' },
          { id: 2, name: 'Truffle Carbonara', price: 24.99, image: '/api/placeholder/400/300', description: 'Creamy pasta with black truffle and pancetta', category: 'Pasta' },
          { id: 3, name: 'Wagyu Beef Pizza', price: 35.99, image: '/api/placeholder/400/300', description: 'Premium Wagyu beef with seasonal vegetables', category: 'Pizza' }
        ]);

        setGoodDeals([
          { id: 4, name: 'Vegetarian Delight', price: 19.99, originalPrice: 26.99, image: '/api/placeholder/400/300', description: 'Fresh seasonal vegetables with house-made cheese', category: 'Vegetarian' },
          { id: 5, name: 'Family Feast', price: 45.99, originalPrice: 62.99, image: '/api/placeholder/400/300', description: 'Perfect sharing platter for 4-6 people', category: 'Family' }
        ]);

        setSaleOfMonth([
          { id: 6, name: 'Crystal Tomato Caprese', price: 22.99, originalPrice: 29.99, image: '/api/placeholder/400/300', description: 'Heritage tomatoes with fresh mozzarella', category: 'Special' }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dishes:', error);
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Inspired by Pizza 4P's */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        {/* Background Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full animate-pulse-slow"></div>
          <div className="absolute top-40 right-32 w-32 h-32 bg-white rounded-full animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-40 w-24 h-24 bg-white rounded-full animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-white rounded-full animate-pulse-slow" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <ChefHat className="h-16 w-16 text-orange-400 mr-4" />
              <h1 className="text-6xl md:text-8xl font-bold text-gradient">
                Loyal Restaurant
              </h1>
            </div>
            <p className="text-lg md:text-xl text-neutral-300 font-light tracking-widest">
              VIETNAM
            </p>
          </div>

          {/* Main Message */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-light mb-6 leading-tight">
              "Oneness"
              <span className="block text-orange-400 font-medium mt-2">Find your Happiness</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Earth to People is our expression of gratitude to these ingredients, 
              from their origin, their growers, our chefs and lastly to our guests.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
              <BookOpen className="h-5 w-5" />
              VIEW MENU
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3">
              <Calendar className="h-5 w-5" />
              RESERVATION
            </button>
            <button className="border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3">
              <ShoppingBag className="h-5 w-5" />
              DELIVERY
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-6 py-3 rounded-full border border-white/20">
              <Clock className="h-5 w-5 text-orange-400" />
              <span className="font-medium">Open Daily 11AM-11PM</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-6 py-3 rounded-full border border-white/20">
              <Globe className="h-5 w-5 text-orange-400" />
              <span className="font-medium">Multiple Locations</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-6 py-3 rounded-full border border-white/20">
              <Leaf className="h-5 w-5 text-orange-400" />
              <span className="font-medium">Sustainable & Fresh</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ArrowRight className="h-6 w-6 rotate-90" />
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-neutral-900 mb-6">
              Our Vision
            </h2>
            <h3 className="text-3xl font-medium text-orange-600 mb-8">
              Make the World Smile for Peace
            </h3>
            <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
              Since 2011, we have been committed to creating moments of joy and connection 
              through exceptional food and genuine hospitality. Our mission extends beyond 
              serving great pizza to fostering peace and happiness in our communities.
            </p>
          </div>

          {/* WOW Score */}
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-primary p-8 rounded-3xl shadow-2xl">
              <div className="text-white">
                <h4 className="text-2xl font-bold mb-2">WOW!!!</h4>
                <p className="text-lg opacity-90">Since 2011〜</p>
                <p className="text-sm opacity-80 mt-2">"WOW" is the highest satisfaction score received from all shops</p>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Oneness</h3>
              <p className="text-neutral-600 leading-relaxed">
                We believe in the connection between Earth and People, creating harmony 
                through sustainable practices and authentic relationships.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <Leaf className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Sustainability</h3>
              <p className="text-neutral-600 leading-relaxed">
                Committed to regenerative practices, we source ingredients responsibly 
                and minimize our environmental impact for future generations.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                <Smile className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Peace</h3>
              <p className="text-neutral-600 leading-relaxed">
                Through food, we create moments of joy and connection that transcend 
                cultural boundaries and bring people together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-neutral-900 mb-6">Menu</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully crafted selection of authentic Italian dishes, 
              made with the finest ingredients and traditional techniques.
            </p>
          </div>

          {/* Featured Dishes Carousel */}
          <div className="relative mb-16">
            <div className="overflow-hidden rounded-3xl">
              <div className="flex transition-transform duration-500 ease-in-out" style={{transform: `translateX(-${currentSlide * 100}%)`}}>
                {bestSellers.map((dish, index) => (
                  <div key={dish.id} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-12 rounded-3xl">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                          <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
                              {dish.category}
                            </span>
                          </div>
                          <h3 className="text-4xl font-bold text-neutral-900 mb-6">{dish.name}</h3>
                          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">{dish.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-orange-600">${dish.price}</span>
                            <button className="btn-primary">
                              Order Now
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="aspect-square bg-gradient-to-br from-orange-200 to-red-200 rounded-3xl flex items-center justify-center">
                            <ChefHat className="h-24 w-24 text-orange-600 opacity-60" />
                          </div>
                          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-300 rounded-full opacity-20"></div>
                          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-300 rounded-full opacity-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex justify-center mt-8 space-x-4">
              {bestSellers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-orange-500' : 'bg-neutral-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Menu Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Best Sellers */}
            <div className="card hover-lift">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-2xl font-bold text-neutral-900">Best Sellers</h3>
                </div>
                <div className="space-y-4">
                  {bestSellers.slice(0, 2).map((dish) => (
                    <div key={dish.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">{dish.name}</h4>
                        <p className="text-sm text-neutral-600">{dish.description}</p>
                        <p className="text-orange-600 font-bold">${dish.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Offers */}
            <div className="card hover-lift">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-6 w-6 text-green-600" />
                  <h3 className="text-2xl font-bold text-neutral-900">Special Offers</h3>
                </div>
                <div className="space-y-4">
                  {goodDeals.map((dish) => (
                    <div key={dish.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">{dish.name}</h4>
                        <p className="text-sm text-neutral-600">{dish.description}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-green-600 font-bold">${dish.price}</p>
                          <p className="text-neutral-400 text-sm line-through">${dish.originalPrice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Special */}
            <div className="card hover-lift">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="h-6 w-6 text-red-600" />
                  <h3 className="text-2xl font-bold text-neutral-900">Monthly Special</h3>
                </div>
                <div className="space-y-4">
                  {saleOfMonth.map((dish) => (
                    <div key={dish.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-200 to-pink-200 rounded-lg flex items-center justify-center">
                        <Star className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900">{dish.name}</h4>
                        <p className="text-sm text-neutral-600">{dish.description}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-red-600 font-bold">${dish.price}</p>
                          <p className="text-neutral-400 text-sm line-through">${dish.originalPrice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* View Menu Button */}
          <div className="text-center mt-12">
            <button className="btn-primary text-lg px-12 py-4">
              VIEW FULL MENU
            </button>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-neutral-900 mb-6">Location</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Find us at multiple locations across Vietnam. Each restaurant offers 
              the same exceptional quality and warm hospitality.
            </p>
          </div>

          {/* Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="card hover-lift">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Ho Chi Minh City</h3>
                </div>
                <p className="text-neutral-600 mb-4">Multiple locations across the city</p>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Pizza 4P's Saigon Centre</li>
                  <li>• Pizza 4P's Vincom Plaza 3/2</li>
                  <li>• Pizza 4P's Estella Place</li>
                  <li>• Pizza 4P's Lotte West Lake</li>
                </ul>
              </div>
            </div>

            <div className="card hover-lift">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Hanoi</h3>
                </div>
                <p className="text-neutral-600 mb-4">Capital city locations</p>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Pizza 4P's Landmark 72</li>
                  <li>• Pizza 4P's Lotte Center</li>
                  <li>• Pizza 4P's Vincom Long Biên</li>
                  <li>• Pizza 4P's Hoàng Thành</li>
                </ul>
              </div>
            </div>

            <div className="card hover-lift">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-neutral-900">Other Cities</h3>
                </div>
                <p className="text-neutral-600 mb-4">Expanding nationwide</p>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Pizza 4P's Indochina Đà Nẵng</li>
                  <li>• Pizza 4P's Sheraton Nha Trang</li>
                  <li>• Pizza 4P's Aeon Mall Hải Phòng</li>
                  <li>• More locations coming soon</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Find Location Button */}
          <div className="text-center">
            <button className="btn-primary text-lg px-12 py-4">
              FIND NEAREST LOCATION
            </button>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light mb-6">Join Us!</h2>
            <h3 className="text-3xl font-medium text-orange-400 mb-8">
              Join us on the mission of sharing happiness, one pizza at a time.
            </h3>
            <p className="text-xl text-neutral-300 max-w-4xl mx-auto leading-relaxed">
              Be part of our journey to create moments of joy and connection. 
              Whether as a guest or team member, you're welcome to join our family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Career</h3>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                Join our team and be part of creating exceptional dining experiences. 
                We offer opportunities for growth, learning, and making a positive impact.
              </p>
              <button className="btn-secondary">
                VIEW CAREER OPPORTUNITIES
              </button>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Community</h3>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                Connect with our community of food lovers, sustainability advocates, 
                and peace builders. Share your stories and be part of our mission.
              </p>
              <button className="btn-secondary">
                JOIN OUR COMMUNITY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-neutral-900 mb-4">Contact Us</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Get in touch with us for reservations, inquiries, or feedback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Mail className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">For Inquiry</h3>
              <p className="text-neutral-600 mb-4">General questions and information</p>
              <a href="mailto:info@pizza4ps.com" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                info@pizza4ps.com
              </a>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">For Feedback</h3>
              <p className="text-neutral-600 mb-4">Share your experience with us</p>
              <a href="mailto:feedback@pizza4ps.com" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                feedback@pizza4ps.com
              </a>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Reservations</h3>
              <p className="text-neutral-600 mb-4">Book your table today</p>
              <button className="btn-primary">
                MAKE RESERVATION
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-16 pt-8 border-t border-neutral-200">
            <p className="text-neutral-500 text-sm">
              © 2024 Pizza 4P's Vietnam. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
 