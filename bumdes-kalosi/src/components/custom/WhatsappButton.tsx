"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export function WhatsAppButton({ phoneNumber, message = "" }: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide if on admin dashboard AND user is SUPER_ADMIN
  if (pathname?.startsWith("/admin") && session?.user?.role === "SUPER_ADMIN") {
    return null;
  }

  // Default strings in Bahasa Indonesia
  const t = {
    defaultMessage: "Halo Admin, saya butuh bantuan...",
    tooltip: "Hubungi Kami via WhatsApp"
  };


  // Format nomor: hapus karakter non-digit dan tambahkan kode negara jika belum ada
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    // Jika tidak dimulai dengan kode negara, tambahkan 62 (Indonesia)
    if (!cleaned.startsWith("62") && !cleaned.startsWith("0")) {
      return `62${cleaned}`;
    }
    // Jika dimulai dengan 0, ganti dengan 62
    if (cleaned.startsWith("0")) {
      return `62${cleaned.substring(1)}`;
    }
    return cleaned;
  };

  const handleClick = () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    // Use provided message or default message based on language
    const finalMessage = message || t.defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${formattedPhone}${finalMessage ? `?text=${encodedMessage}` : ""}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999] cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      aria-label={t.tooltip}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-fadeInUp">
          {t.tooltip}
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* WhatsApp Button */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group-hover:bg-[#20BD5A]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          className="w-9 h-9 sm:w-10 sm:h-10 text-white"
        >
          <path
            fill="currentColor"
            d="M733.9,267.2c-62-62.1-144.6-96.3-232.5-96.4c-181.1,0-328.6,147.4-328.6,328.6c0,57.9,15.1,114.5,43.9,164.3L170.1,834l174.2-45.7c48,26.2,102,40,157,40h0.1c0,0,0,0,0,0c181.1,0,328.5-147.4,328.6-328.6C830.1,411.9,796,329.3,733.9,267.2z M501.5,772.8h-0.1c-49,0-97.1-13.2-139-38.1l-10-5.9L249,755.9l27.6-100.8l-6.5-10.3c-27.3-43.5-41.8-93.7-41.8-145.4c0.1-150.6,122.6-273.1,273.3-273.1c73,0,141.5,28.5,193.1,80.1c51.6,51.6,80,120.3,79.9,193.2C774.6,650.3,652,772.8,501.5,772.8z M651.3,568.2c-8.2-4.1-48.6-24-56.1-26.7c-7.5-2.7-13-4.1-18.5,4.1c-5.5,8.2-21.2,26.7-26,32.2c-4.8,5.5-9.6,6.2-17.8,2.1c-8.2-4.1-34.7-12.8-66-40.8c-24.4-21.8-40.9-48.7-45.7-56.9c-4.8-8.2-0.5-12.7,3.6-16.8c3.7-3.7,8.2-9.6,12.3-14.4c4.1-4.8,5.5-8.2,8.2-13.7c2.7-5.5,1.4-10.3-0.7-14.4c-2.1-4.1-18.5-44.5-25.3-61c-6.7-16-13.4-13.8-18.5-14.1c-4.8-0.2-10.3-0.3-15.7-0.3c-5.5,0-14.4,2.1-21.9,10.3c-7.5,8.2-28.7,28.1-28.7,68.5c0,40.4,29.4,79.5,33.5,84.9c4.1,5.5,57.9,88.4,140.3,124c19.6,8.5,34.9,13.5,46.8,17.3c19.7,6.3,37.6,5.4,51.7,3.3c15.8-2.4,48.6-19.9,55.4-39c6.8-19.2,6.8-35.6,4.8-39C665,574.4,659.5,572.4,651.3,568.2z"
          />
        </svg>
      </div>

      {/* Pulse animation */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 pointer-events-none" />
    </div>
  );
}

