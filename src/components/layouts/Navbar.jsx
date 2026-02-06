import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { type: "anchor", href: "#beranda", label: "Beranda" },
    { type: "anchor", href: "#tentang", label: "Tentang" },
    { type: "route", href: "/kontak", label: "Kontak" },
    { type: "route", href: "/lowongan-publik", label: "Lowongan" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveLink(location.pathname);
    }
  }, [location]);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    setActiveLink(href);

    if (location.pathname !== "/") {
      navigate("/" + href);
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="w-28 h-28 flex items-center justify-center">
              <img src="/src/public/images/logo1.png" alt="Logo" />
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link, index) =>
              link.type === "route" ? (
                <Link
                  key={index}
                  to={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={`font-medium transition-colors ${
                    activeLink === link.href
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className={`font-medium transition-colors ${
                    activeLink === link.href
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </a>
              ),
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link, index) =>
              link.type === "route" ? (
                <Link
                  key={index}
                  to={link.href}
                  onClick={() => {
                    setActiveLink(link.href);
                    setIsOpen(false);
                  }}
                  className={`block px-4 py-2 font-medium transition-colors ${
                    activeLink === link.href
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href);
                    setIsOpen(false);
                  }}
                  className={`block px-4 py-2 font-medium transition-colors ${
                    activeLink === link.href
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
