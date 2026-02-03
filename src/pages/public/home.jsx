import AboutSection from "../../components/landing/About";
import HeroSection from "../../components/landing/Hero";
import Navbar from "../../components/layouts/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
    </div>
  );
};

export default HomePage;
