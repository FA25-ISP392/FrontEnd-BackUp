import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {/* Restaurant Info */}
          <div>
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-lg font-semibold">Nhà Hàng</span>
            </div>
            <p className="text-neutral-600 text-sm mb-4 text-center">
              Ẩm thực tinh tế, tiện nghi hiện đại, dịch vụ xuất sắc. Trải nghiệm
              sự hoàn hảo trong nghệ thuật ẩm thực giữa không gian ấm áp và
              thanh lịch.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4 text-center">
              Thông tin liên hệ
            </h3>
            <div className="space-y-3 text-sm text-neutral-600 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+84 123-456-789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>PersonaDine@restaurant.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>7 D1, Long Thạnh Mỹ, TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">Giờ phục vụ</h3>
            <div className="space-y-3 text-sm text-neutral-600 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Thứ 2-Thứ 5: 11AM-10PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Thứ 6-Thứ 7: 11AM-11PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Chủ Nhật: 12PM-11PM</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-4">
              Theo dõi chúng tôi
            </h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <a
                href="#"
                className="flex flex-col items-center gap-2 text-center"
              >
                Facebook
              </a>
              <a
                href="#"
                className="flex flex-col items-center gap-2 text-center"
              >
                Instagram
              </a>
              <a
                href="#"
                className="flex flex-col items-center gap-2 text-center"
              >
                Threads
              </a>
              <a
                href="#"
                className="flex flex-col items-center gap-2 text-center"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-sm text-neutral-600 flex flex-col md:flex-row items-center justify-between">
          <p>
            &copy; {new Date().getFullYear()} Nhà hàng. Mọi quyền được bảo lưu.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-900 transition">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-neutral-900 transition">
              Điều khoản dịch vụ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
