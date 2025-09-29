import {
  ArrowRight,
  ChefHat,
  Star,
  Clock,
  Users,
  Calendar,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient and floating elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-red-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fadeIn">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-2xl mb-6 animate-heartbeat floating">
              <ChefHat className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-glow pulse-text">
              Restaurant
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Trải nghiệm ẩm thực tuyệt vời với những món ăn được chế biến từ
              nguyên liệu tươi ngon nhất
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeIn stagger-1">
            <button className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-orange-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-3 btn-animated">
              <span>Xem Thực Đơn</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-3 btn-animated">
              <span>Đặt Bàn</span>
              <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fadeIn stagger-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group card-hover floating">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform card-icon">
                <Star className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">4.8/5</div>
              <div className="text-neutral-300">Đánh giá khách hàng</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group card-hover floating" style={{animationDelay: '1s'}}>
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform card-icon">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">18:00</div>
              <div className="text-neutral-300">Giờ tới ăn</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group card-hover floating" style={{animationDelay: '2s'}}>
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform card-icon">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-neutral-300">Khách hàng hài lòng</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
