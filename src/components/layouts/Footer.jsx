import React from "react";
import {
  Facebook,
  Instagram,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
} from "lucide-react";
import useScrollAnimation from "../../hooks/useScrollAnimation";

const Footer = () => {
  const [footerRef, footerVisible] = useScrollAnimation(0.1);

  return (
    <footer
      ref={footerRef}
      className="bg-primary-dark text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`mb-6 transition-all duration-700 ${
            footerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <img
            src="/images/logo2.png"
            alt="PT Surya Tamado Mandiri Logo"
            className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div
            className={`flex flex-col mb-6 transition-all duration-700 ${
              footerVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-20"
            }`}
            style={{ transitionDelay: footerVisible ? "200ms" : "0ms" }}
          >
            <h3 className="text-xl font-semibold mb-4 min-h-7">
              PT SURYA TAMADO MANDIRI
            </h3>

            <p className="text-lg text-cyan-50 leading-relaxed">
              Jalan Sultan Serdang Psr.8 <br />
              Tanjung Morawa Deli Serdang, <br />
              Sumatera Utara Indonesia
            </p>
          </div>

          <div
            className={`flex flex-col items-center transition-all duration-700 ${
              footerVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{ transitionDelay: footerVisible ? "400ms" : "0ms" }}
          >
            <h3 className="text-xl font-semibold mb-4 text-center min-h-7">
              Terhubung Dengan Kami
            </h3>

            <div className="flex items-center justify-center gap-14">
              <a className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-125 transition-all duration-300 hover:rotate-12">
                <Facebook size={20} />
              </a>
              <a className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-125 transition-all duration-300 hover:rotate-12">
                <Instagram size={20} />
              </a>
              <a className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-125 transition-all duration-300 hover:rotate-12">
                {/* TikTok */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.01-2.74V9.4A6.33 6.33 0 1 0 15.86 15V8a8.16 8.16 0 0 0 4.77 1.52V6.12a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div
            className={`flex flex-col transition-all duration-700 ${
              footerVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
            style={{ transitionDelay: footerVisible ? "600ms" : "0ms" }}
          >
            <h3 className="text-xl font-semibold mb-4 min-h-7">Dukungan</h3>

            <ul className="space-y-2 text-lg text-cyan-50">
              <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">
                Pusat Bantuan
              </li>
              <li className="hover:text-white hover:translate-x-2 transition-all duration-300 cursor-pointer">
                Kontak
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-primary border-t border-white/20 mt-8">
        <p
          className={`text-center text-sm py-4 text-cyan-50 transition-all duration-700 ${
            footerVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: footerVisible ? "800ms" : "0ms" }}
        >
          © 2025 PT SURYA TAMADO MANDIRI
        </p>
      </div>
    </footer>
  );
};

export default Footer;
