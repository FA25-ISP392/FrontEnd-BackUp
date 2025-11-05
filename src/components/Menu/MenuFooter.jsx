import { ChefHat, Phone, Mail, MapPin, Clock, Star } from "lucide-react";

export default function MenuFooter() {
  return (
    <footer className="bg-white text-neutral-700 py-16 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Cột 1 - Thông tin nhà hàng */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">MónCủaBạn</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              Trải nghiệm ẩm thực cá nhân hóa. Chúng tôi mang đến những món ăn
              chất lượng, phù hợp với mục tiêu và sở thích của riêng bạn.
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
              <span className="text-sm text-neutral-500">(1,234 đánh giá)</span>
            </div>
          </div>

          {/* Cột 2 - Thông tin liên hệ */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-900">
              Thông tin liên hệ
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm">7 D1, Long Thạnh Mỹ, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm">info@moncuaban.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm">10:00 - 22:00 (Hàng ngày)</span>
              </div>
            </div>
          </div>

          {/* Cột 3 - Liên kết nhanh */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-900">
              Liên kết nhanh
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#"
                className="text-sm text-neutral-600 hover:text-orange-600 transition-colors"
              >
                Về chúng tôi
              </a>
              <a
                href="#"
                className="text-sm text-neutral-600 hover:text-orange-600 transition-colors"
              >
                Thực đơn
              </a>
              <a
                href="#"
                className="text-sm text-neutral-600 hover:text-orange-600 transition-colors"
              >
                Đặt bàn
              </a>
              <a
                href="#"
                className="text-sm text-neutral-600 hover:text-orange-600 transition-colors"
              >
                Tin tức
              </a>
              <a
                href="#"
                className="text-sm text-neutral-600 hover:text-orange-600 transition-colors"
              >
                Liên hệ
              </a>
              <a
                href="#"
                className="text-sm text-neutral-600 hover:text-orange-600 transition-colors"
              >
                FAQs
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-12 pt-8 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} MónCủaBạn. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}
