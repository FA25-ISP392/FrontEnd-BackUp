import React from "react";

const slides = [
  {
    src: "https://surl.li/lmaaao",
    alt: "Ảnh 1",
  },
  {
    src: "https://surl.li/jmyzqo",
    alt: "Ảnh 2",
  },
  {
    src: "https://surl.li/bgvdsv",
    alt: "Ảnh 3",
  },
  {
    src: "https://surl.li/uelvyx",
    alt: "Ảnh 4",
  },
  { src: "https://surl.li/vizpzd", alt: "Ảnh 5" },
];

export default function HeroSection() {
  const [i, setI] = React.useState(0);
  const timer = React.useRef(null);

  React.useEffect(() => {
    timer.current = setInterval(() => {
      setI((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer.current);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Ảnh nền */}
      <div className="absolute inset-0">
        {slides.map((s, idx) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
      </div>

      {/* Dots điều hướng */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2.5 w-2.5 rounded-full border border-white/60 transition-all ${
              idx === i
                ? "bg-white/90 scale-110"
                : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Ảnh ${idx + 1}`}
          />
        ))}
      </div>

      {/* Nút mũi tên (ẩn trên mobile) */}
      <button
        onClick={() => setI((i - 1 + slides.length) % slides.length)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center"
        aria-label="Ảnh trước"
      >
        ‹
      </button>
      <button
        onClick={() => setI((i + 1) % slides.length)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center"
        aria-label="Ảnh sau"
      >
        ›
      </button>
    </section>
  );
}
