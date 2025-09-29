import HeroSection from "../components/Home/HeroSection";
import VisionSection from "../components/Home/VisionSection";
import MenuSection from "../components/Home/MenuSection";
import { MapPin, Phone, Mail } from "lucide-react"; // ✅ Thêm import icon

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
                    7 D1, Long Thạnh Mỹ, TP.HCM
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <span className="text-neutral-700">+84 123-456-789</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <span className="text-neutral-700">
                    comqueduongbau@restaurant.com
                  </span>
                </div>
              </div>
            </div>
            {/* Dùng iframe của GG Map */}
            <div className="rounded-2xl overflow-hidden h-64">
              <iframe
                title="Restaurant Map"
                src={
                  "https://www.google.com/maps?q=" +
                  encodeURIComponent(
                    "7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000, Việt Nam"
                  ) +
                  "&output=embed"
                }
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
