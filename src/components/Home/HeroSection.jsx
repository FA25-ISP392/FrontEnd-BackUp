import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Không Gian Ấm Cúng",
    subtitle: "Tận hưởng những khoảnh khắc đáng nhớ bên người thân.",
  },
  {
    url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    title: "Ẩm Thực Tinh Tế",
    subtitle: "Khám phá hương vị độc đáo từ những nguyên liệu tươi ngon nhất.",
  },
  {
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    title: "Phục Vụ Tận Tâm",
    subtitle: "Trải nghiệm dịch vụ chuyên nghiệp và thân thiện.",
  },
];

const SLIDE_DURATION = 5000;

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-linear ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
              style={{ backgroundImage: `url(${slide.url})` }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white p-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 shadow-text-lg animate-fade-in-up">
          {slides[currentSlide].title}
        </h1>
        <p className="text-xl md:text-2xl text-neutral-200 max-w-2xl mb-8 shadow-text-lg animate-fade-in-up delay-100">
          {slides[currentSlide].subtitle}
        </p>
        <button
          onClick={() => {
            window.location.href = "/home/datban";
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg transform active:scale-95 animate-fade-in-up delay-200"
        >
          Đặt Bàn Ngay
        </button>
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 z-20 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white hover:bg-white/40 transition-all"
        aria-label="Ảnh trước"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 z-20 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white hover:bg-white/40 transition-all"
        aria-label="Ảnh sau"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Đi đến ảnh ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
