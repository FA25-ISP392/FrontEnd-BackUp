import HeroSection from "../components/Home/HeroSection";
import VisionSection from "../components/Home/VisionSection";
import MenuSection from "../components/Home/MenuSection";
import { MapPin, Phone, Mail, Clock } from "lucide-react"; // ✅ Thêm import icon
import { Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <VisionSection />
      <MenuSection />

      {/* Location Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Vị trí của chúng tôi
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Ghé thăm nhà hàng của chúng tôi tại vị trí thuận tiện và không
              gian đẹp mắt
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                Thông tin liên hệ
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span className="text-neutral-700">
                    123 Đường ABC, Quận 1, TP.HCM
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <span className="text-neutral-700">+84 123 456 789</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <span className="text-neutral-700">info@restaurant.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-neutral-700">
                    10:00 - 22:00 (Hàng ngày)
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-neutral-200 rounded-2xl h-64 flex items-center justify-center">
              <span className="text-neutral-500">
                Bản đồ sẽ được tích hợp ở đây
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tham gia cùng chúng tôi
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Trở thành một phần của đội ngũ nhà hàng và cùng tạo ra những trải
            nghiệm ẩm thực tuyệt vời
          </p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-neutral-100 transition-all duration-300 shadow-lg">
            Xem cơ hội việc làm
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Restaurant</h3>
              <p className="text-neutral-300 leading-relaxed">
                Chúng tôi cam kết mang đến trải nghiệm ẩm thực tuyệt vời với
                những món ăn chất lượng cao và dịch vụ chuyên nghiệp.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  Về chúng tôi
                </a>
                <a
                  href="#"
                  className="block text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  Thực đơn
                </a>
                <a
                  href="#"
                  className="block text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  Đặt bàn
                </a>
                <a
                  href="#"
                  className="block text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  Tin tức
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Theo dõi chúng tôi</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="block text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="block text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="block text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-12 pt-8 text-center">
            <p className="text-neutral-400">
              © 2024 Restaurant. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
