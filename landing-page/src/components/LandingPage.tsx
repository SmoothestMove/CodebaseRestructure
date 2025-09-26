import AsSeenOn from "./landingPageComponents/AsSeenOn";
import BeforeAfter from "./landingPageComponents/BeforeAfter";
import DemoSection from "./landingPageComponents/DemoSection";
import FaqSection from "./landingPageComponents/FaqSection";
import FeatureDisplay from "./landingPageComponents/FeatureDisplay";
import FinalPush from "./landingPageComponents/FinalPush";
import Footer from "./landingPageComponents/Footer";
import HeroSection from "./landingPageComponents/HeroSection";
import PricingSection from "./landingPageComponents/PricingSection";
import Testimonials from "./landingPageComponents/Testimonials";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <BeforeAfter />
      <FeatureDisplay />
      <DemoSection />
      <PricingSection />
      <FaqSection />
      <AsSeenOn />
      <Testimonials />
      <FinalPush />
      <Footer />
    </>
  );
}

export default LandingPage;
