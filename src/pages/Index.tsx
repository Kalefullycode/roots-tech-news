import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import HeroSection from "@/components/HeroSection";
import MainFeed from "@/components/MainFeed";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <BreakingNewsBanner />
      <Header />
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <MainFeed />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;