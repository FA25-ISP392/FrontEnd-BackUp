// src/components/Home/TypewriterText.jsx
import { useState, useEffect } from "react";

/**
 * Component để tạo hiệu ứng gõ chữ (typewriter effect).
 * @param {string} text - Đoạn văn bản đầy đủ cần hiển thị.
 * @param {number} [speed=30] - Tốc độ gõ (ms mỗi chữ).
 * @param {string} [className=""] - Class CSS tùy chỉnh cho thẻ <p>.
 */
export default function TypewriterText({ text, speed = 30, className = "" }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset văn bản khi modal được mở (hoặc text prop thay đổi)
    let i = 0;

    // Đặt hẹn giờ để thêm từng chữ
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer); // Dừng lại khi đã gõ xong
      }
    }, speed);

    // Cleanup function: Dọn dẹp interval khi component bị unmount (modal đóng)
    return () => clearInterval(timer);
  }, [text, speed]); // Chạy lại hiệu ứng mỗi khi text hoặc speed thay đổi

  return <p className={className}>{displayedText}</p>;
}
