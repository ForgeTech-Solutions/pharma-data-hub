import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import UseCasesSection from "@/components/UseCasesSection";
import StackSection from "@/components/StackSection";
import CodeSection from "@/components/CodeSection";
import EndpointsSection from "@/components/EndpointsSection";
import DeploySection from "@/components/DeploySection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StackSection />
      <CodeSection />
      <EndpointsSection />
      <DeploySection />
      <FooterSection />
    </div>
  );
};

export default Index;
