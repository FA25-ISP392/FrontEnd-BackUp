import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ChefHat, ShoppingBag, X } from "lucide-react";
import { getBestSellingDishes } from "../../lib/apiStatistics";
import { getDish } from "../../lib/apiDish";

export default function MenuSection() {
  const [featured, setFeatured] = useState([]);
  const [mustTry, setMustTry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        // 🔹 Lấy danh sách món bán chạy
        const best = await getBestSellingDishes({
          year,
          month,
          limit: 5,
        });

        // 🔹 Gọi thêm API getDish(id) để lấy chi tiết từng món
        const detailed = await Promise.all(
          best.map(async (b) => {
            try {
              const dish = await getDish(b.itemId);
              return { ...dish, totalSold: b.totalSold };
            } catch {
              return {
                itemId: b.itemId,
                itemName: b.itemName,
                totalSold: b.totalSold,
              };
            }
          }),
        );

        setFeatured(detailed.slice(0, 3));
        setMustTry(detailed.slice(0, 10));
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu món:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // Tự động slide
  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % featured.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + featured.length) % featured.length);

  if (loading)
    return (
      <section className="py-20 bg-gradient-to-br from-white via-orange-50 to-red-50 text-center">
        <p className="text-neutral-500 animate-pulse">
          Đang tải món ăn nổi bật...
        </p>
      </section>
    );

  return (
    <section className="py-20 bg-gradient-to-br from-white via-orange-50 to-red-50 relative overflow-hidden">
      {/* Decor */}
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
            Khám phá những món ăn được yêu thích nhất tháng này
          </p>
        </div>

        {/* 🌟 Món ăn nổi bật */}
        <div className="relative mb-16 animate-fade-in-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-900">
                Món ăn nổi bật
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featured.map((dish) => (
                  <div
                    key={dish.dishId || dish.itemId}
                    className="w-full flex-shrink-0"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div>
                        <img
                          src={dish.picture || dish.imageUrl || dish.image}
                          alt={dish.name || dish.dishName || dish.itemName}
                          className="w-full h-64 object-cover rounded-2xl shadow-lg"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <ChefHat className="h-5 w-5 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">
                            {dish.category || "Món ăn"}
                          </span>
                        </div>
                        <h4 className="text-3xl font-bold text-neutral-900 mb-4">
                          {dish.name || dish.dishName || dish.itemName}
                        </h4>
                        <p className="text-neutral-600 mb-6 leading-relaxed line-clamp-3">
                          {dish.description || "Không có mô tả."}
                        </p>
                        <div className="flex items-center justify-between">
                          {/* <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {dish.price
                              ? dish.price.toLocaleString("vi-VN") + "₫"
                              : "—"}
                          </span> */}
                          {/* <button
                            onClick={() => setSelectedDish(dish)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-medium flex items-center gap-2"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            Xem chi tiết
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full ${
                    i === currentSlide
                      ? "bg-gradient-to-r from-orange-500 to-red-500"
                      : "bg-neutral-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 🔥 Các món phải thử */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            Các món phải thử
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {mustTry.map((dish) => (
              <div
                key={dish.dishId || dish.itemId}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                onClick={() => setSelectedDish(dish)}
              >
                <img
                  src={dish.picture || dish.imageUrl || dish.image}
                  alt={dish.name || dish.dishName || dish.itemName}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-neutral-900 text-sm line-clamp-1">
                    {dish.name || dish.dishName || dish.itemName}
                  </h4>
                  <p className="text-xs text-neutral-600 line-clamp-2 mb-2">
                    {dish.description || "Không có mô tả"}
                  </p>
                  {/* <p className="text-lg font-bold text-orange-600">
                    {dish.price
                      ? dish.price.toLocaleString("vi-VN") + "₫"
                      : "—"}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal xem chi tiết */}
      {selectedDish && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={
                selectedDish.picture ||
                selectedDish.imageUrl ||
                selectedDish.image
              }
              alt={selectedDish.dishName || selectedDish.itemName}
              className="w-full h-[550px] object-cover rounded-2xl mb-6"
            />
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              {selectedDish.dishName || selectedDish.itemName}
            </h3>
            <p className="text-neutral-700 mb-4">
              {selectedDish.description || "Không có mô tả chi tiết."}
            </p>
            {/* <p className="text-xl font-bold text-orange-600">
              {selectedDish.price
                ? selectedDish.price.toLocaleString("vi-VN") + "₫"
                : "—"}
            </p> */}
          </div>
        </div>
      )}
    </section>
  );
}
