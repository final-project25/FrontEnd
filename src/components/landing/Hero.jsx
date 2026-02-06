import { useNavigate } from "react-router-dom";
import Button from "../Elements/Button";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section
      id="beranda"
      className="pt-24 pb-16 bg-linear-to-br from-white to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-start pt-10">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-primary">
              Maju Bersama Kami
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-primary">
              PT. Surya Tamado Mandiri
            </h2>
            <p className="text-primary text-2xl">
              Mewujudkan masa depan <br />
              cerah dan terarah
            </p>
            <Button
              onClick={() => navigate("/lowongan-publik")}
              className="text-xl font-normal hover:bg-primary-dark"
              variant="bg-primary"
            >
              Cek Lowongan →
            </Button>
          </div>
          <div className="relative">
            <div className="bg-gray-200 rounded-2xl overflow-hidden max-h-80">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
