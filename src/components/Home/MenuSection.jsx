import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Star,
  ShoppingBag,
} from "lucide-react";

export default function MenuSection() {
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
          {
            id: 1,
            name: "Burrata Parma Ham Margherita",
            price: 28.99,
            image: "/api/placeholder/400/300",
            description:
              "Fresh burrata cheese with premium Parma ham and basil",
            category: "Pizza",
          },
          {
            id: 2,
            name: "Truffle Carbonara",
            price: 24.99,
            image: "/api/placeholder/400/300",
            description: "Creamy pasta with black truffle and pancetta",
            category: "Pasta",
          },
          {
            id: 3,
            name: "Wagyu Beef Pizza",
            price: 35.99,
            image: "/api/placeholder/400/300",
            description: "Premium Wagyu beef with seasonal vegetables",
            category: "Pizza",
          },
        ]);

        setGoodDeals([
          {
            id: 4,
            name: "Vegetarian Delight",
            price: 19.99,
            originalPrice: 26.99,
            image: "/api/placeholder/400/300",
            description: "Fresh seasonal vegetables with house-made cheese",
            category: "Vegetarian",
          },
          {
            id: 5,
            name: "Family Feast",
            price: 45.99,
            originalPrice: 62.99,
            image: "/api/placeholder/400/300",
            description: "Perfect sharing platter for 4-6 people",
            category: "Family",
          },
        ]);

        setSaleOfMonth([
          {
            id: 6,
            name: "Crystal Tomato Caprese",
            price: 22.99,
            originalPrice: 29.99,
            image: "/api/placeholder/400/300",
            description: "Heritage tomatoes with fresh mozzarella",
            category: "Special",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dishes:", error);
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bestSellers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bestSellers.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bestSellers.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bestSellers.length) % bestSellers.length,
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Thực đơn đặc biệt
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá những món ăn được yêu thích nhất và các ưu đãi hấp dẫn
          </p>
        </div>

        {/* Featured Dishes Carousel */}
        <div className="relative mb-16 animate-fade-in-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-900">
                Món ăn nổi bật
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center shadow-lg"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {bestSellers.map((dish) => (
                  <div key={dish.id} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div>
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-64 object-cover rounded-2xl shadow-lg"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <ChefHat className="h-5 w-5 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">
                            {dish.category}
                          </span>
                        </div>
                        <h4 className="text-3xl font-bold text-neutral-900 mb-4">
                          {dish.name}
                        </h4>
                        <p className="text-neutral-600 mb-6 leading-relaxed">
                          {dish.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ${dish.price}
                          </span>
                          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Đặt món
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {bestSellers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-gradient-to-r from-orange-500 to-red-500"
                      : "bg-neutral-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Best Sellers */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">
                Bán chạy nhất
              </h3>
            </div>
            <div className="space-y-4">
              {bestSellers.map((dish) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900">
                      {dish.name}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      {dish.description}
                    </p>
                    <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      ${dish.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Good Deals */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Ưu đãi tốt</h3>
            </div>
            <div className="space-y-4">
              {goodDeals.map((dish) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900">
                      {dish.name}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      {dish.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${dish.price}
                      </span>
                      <span className="text-sm text-neutral-500 line-through">
                        ${dish.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sale of Month */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Tháng này</h3>
            </div>
            <div className="space-y-4">
              {saleOfMonth.map((dish) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900">
                      {dish.name}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      {dish.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${dish.price}
                      </span>
                      <span className="text-sm text-neutral-500 line-through">
                        ${dish.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View Full Menu Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-orange-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
            <span>XEM TOÀN BỘ THỰC ĐƠN</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
