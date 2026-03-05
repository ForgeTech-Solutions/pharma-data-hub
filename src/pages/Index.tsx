import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import UseCasesSection from "@/components/UseCasesSection";
import CodeSection from "@/components/CodeSection";
import EndpointsSection from "@/components/EndpointsSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <CodeSection />
      <EndpointsSection />
      <FooterSection />
    </div>
  );
};

export default Index;
