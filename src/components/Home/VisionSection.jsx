import {
  Heart,
  Leaf,
  Smile,
  Globe,
  Award,
  Users,
  Sparkles,
} from "lucide-react";

export default function VisionSection() {
  const values = [
    {
      icon: Heart,
      title: "Tình yêu ẩm thực",
      description: "Chúng tôi đam mê tạo ra những món ăn ngon nhất",
    },
    {
      icon: Leaf,
      title: "Nguyên liệu tươi",
      description: "Sử dụng nguyên liệu tươi ngon từ các nhà cung cấp uy tín",
    },
    {
      icon: Smile,
      title: "Dịch vụ chuyên nghiệp",
      description: "Mang đến trải nghiệm dịch vụ tốt nhất cho khách hàng",
    },
    {
      icon: Globe,
      title: "Hương vị quốc tế",
      description: "Kết hợp tinh hoa ẩm thực từ khắp nơi trên thế giới",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Tầm nhìn của chúng tôi
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi tin rằng ẩm thực không chỉ là việc ăn uống mà còn là nghệ
            thuật, là cách kết nối con người và tạo ra những khoảnh khắc đáng
            nhớ.
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-12 shadow-2xl border-4 border-white/30 mb-16 animate-fade-in-up transition-all duration-500 hover:shadow-3xl">
          <div className="text-center mb-8">
            <h3 className="text-4xl font-bold text-white mb-4 shadow-text">
              Cam Kết Của Chúng Tôi
            </h3>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto shadow-text">
              Mang đến trải nghiệm vượt trội trong từng chi tiết.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 shadow-lg border-2 border-white/50 backdrop-blur-sm">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-2 shadow-text">
                Chất Lượng Hàng Đầu
              </h4>
              <p className="text-orange-50 shadow-text">
                Nguyên liệu tuyển chọn, công thức độc quyền và sự tỉ mỉ trong
                từng món ăn.
              </p>
            </div>

            <div className="text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 shadow-lg border-2 border-white/50 backdrop-blur-sm">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-2 shadow-text">
                Phục Vụ Tận Tâm
              </h4>
              <p className="text-orange-50 shadow-text">
                Đội ngũ nhân viên chuyên nghiệp, thân thiện và luôn sẵn sàng hỗ
                trợ bạn.
              </p>
            </div>

            <div className="text-center text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 shadow-lg border-2 border-white/50 backdrop-blur-sm">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-2 shadow-text">
                Trải Nghiệm Đáng Nhớ
              </h4>
              <p className="text-orange-50 shadow-text">
                Không gian sang trọng, ấm cúng và công nghệ cá nhân hóa độc đáo.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
