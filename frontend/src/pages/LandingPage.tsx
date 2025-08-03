import LandingHeader from '../components/layout/LandingHeader';

// Import all components from landing directory
import Hero from '../components/landing/hero';
import Features from '../components/landing/features';
import HowItWorks from '../components/landing/how-it-works';
import Statistics from '../components/landing/statistics';
import Testimonials from '../components/landing/ui/testimonials';
import Team from '../components/landing/team';
import Pricing from '../components/landing/pricing';
import CTA from '../components/landing/cta';
import Footer from '../components/landing/footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Statistics />
        <Testimonials />
        <Team />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
