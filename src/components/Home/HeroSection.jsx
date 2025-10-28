import React from "react";

const slides = [
  {
    src: "https://lvtgroup.vn/public/elfinder/upload/elfinder/lvt-group/blog/mon-an-chau-au/nhung-mon-an-ngon-nhat-o-chau-au.jpg",
    alt: "Bữa tiệc Âu thịnh soạn",
  },
  {
    src: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfAWgQCqO4Gr8H_gEJg9C-LrOo_AmcwAF7kj2DidCfsepyibLDDlata9SnCcFYIBIm_w-w-Y_aehQfqMefgpILPQEpupNBf76g1wKCaCmfWrTSaptjUQvyFevokoQgBZ1ZAekyZ72Gp5mie6TM_Rq8xhBbD?key=vdGO4w2VZXpcZj6Z80drZg",
    alt: "Bò bít tết nướng thơm ngon",
  },
  {
    src: "https://media.istockphoto.com/id/2116422246/fr/photo/roman-pinsa-with-mozzarella-cheese-capers-arugula-and-garlic-on-wooden-table.jpg?s=612x612&w=0&k=20&c=_htOXWUR9l2IIaHEMx-v6vYT5NdXL6Nok4Z5ZFBgq7U=",
    alt: "Pizza Ý tươi ngon",
  },
  {
    src: "https://monngon-danang.com/content/images/2025/03/nhung-dieu-ban-can-biet-ve-mon-mi-y-thom-ngon.png",
    alt: "Mì Ý truyền thống",
  },
  {
    src: "https://media.istockphoto.com/id/637214478/photo/pasta-plate.jpg?s=612x612&w=0&k=20&c=oebCQG_Zfv2zJpobSzpF6JFNdsBQUjG6MdQh-En5l3c=",
    alt: "Mì Ý sốt cà chua và phô mai",
  },
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
