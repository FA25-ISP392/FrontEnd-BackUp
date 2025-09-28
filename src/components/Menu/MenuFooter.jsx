import { ChefHat, Phone, Mail, MapPin, Clock, Star } from "lucide-react";

export default function MenuFooter() {
  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Restaurant</h3>
                <p className="text-sm text-neutral-400">
                  Fine Dining Experience
                </p>
              </div>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Chúng tôi cam kết mang đến trải nghiệm ẩm thực tuyệt vời với những
              món ăn chất lượng cao và dịch vụ chuyên nghiệp.
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-400">
                4.8/5 (1,234 đánh giá)
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Thông tin liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-neutral-300">
                  +84 123 456 789
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-neutral-300">
                  info@restaurant.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-neutral-300">
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-neutral-300">
                  10:00 - 22:00 (Hàng ngày)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liên kết nhanh</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-sm text-neutral-300 hover:text-orange-500 transition-colors"
              >
                Về chúng tôi
              </a>
              <a
                href="#"
                className="block text-sm text-neutral-300 hover:text-orange-500 transition-colors"
              >
                Thực đơn
              </a>
              <a
                href="#"
                className="block text-sm text-neutral-300 hover:text-orange-500 transition-colors"
              >
                Đặt bàn
              </a>
              <a
                href="#"
                className="block text-sm text-neutral-300 hover:text-orange-500 transition-colors"
              >
                Tin tức
              </a>
              <a
                href="#"
                className="block text-sm text-neutral-300 hover:text-orange-500 transition-colors"
              >
                Liên hệ
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 text-center">
          <p className="text-sm text-neutral-400">
            © 2024 Restaurant. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
