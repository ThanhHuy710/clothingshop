import { Phone } from "lucide-react";
import { CONTACT_LINKS, CONTACT_PHONE_DISPLAY } from "../../config/contact";

export default function FloatingContactButtons() {
  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 md:right-7 z-40 flex flex-col items-center gap-3 select-none"
      aria-label="Kênh liên hệ nhanh"
    >
      {/* Zalo Button */}
      <a
        href={CONTACT_LINKS.zalo}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-[9999px] bg-transparent transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none drop-shadow-md hover:drop-shadow-xl"
        aria-label="Chat Zalo tư vấn trực tiếp"
      >
        <span className="sr-only">Chat Zalo</span>
        <img
          src="/images/zalo.png"
          alt="Zalo"
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Tooltip on desktop */}
        <span className="hidden md:group-hover:flex items-center absolute right-full mr-3 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200">
          Chat qua Zalo
          <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900/90" />
        </span>
      </a>

      {/* Phone Call Button */}
      <a
        href={CONTACT_LINKS.phone}
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-[9999px] bg-[#16A34A] hover:bg-[#15803D] text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        aria-label={`Gọi hotline ${CONTACT_PHONE_DISPLAY}`}
      >
        <span className="sr-only">Gọi hotline</span>
        <Phone size={24} className="fill-current transition-transform group-hover:scale-105" />

        {/* Tooltip on desktop */}
        <span className="hidden md:group-hover:flex items-center absolute right-full mr-3 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200">
          Hotline: {CONTACT_PHONE_DISPLAY}
          <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900/90" />
        </span>
      </a>
    </div>
  );
}
