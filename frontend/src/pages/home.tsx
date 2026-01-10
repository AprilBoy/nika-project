import { useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { useAppData } from "@/components/data-update-context";
import {
  HeroSection,
  AboutSection,
  ProcessSection,
  ClientsSection,
  ServicesSection,
  TestimonialsSection,
  ContactSection,
  Footer
} from "@/components/sections";

export default function Home() {
  const {
    heroData,
    aboutData,
    processData,
    clientData,
    servicesData,
    testimonialsData,
    loading
  } = useAppData();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: "start"  });
  };

  // Handle hash navigation on page load
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the '#'
    if (hash) {
      // Small delay to ensure all sections are rendered
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    }
  }, [loading]); // Re-run when loading state changes


  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(to bottom right, #015645, #022620, #4e6534, #141e13)'
      }}
    >
      <Navigation />

      <HeroSection heroData={heroData} scrollToSection={scrollToSection} />
      <AboutSection aboutData={aboutData} />
      <ProcessSection processData={processData} />
      <ClientsSection clientData={clientData} />
      <ServicesSection servicesData={servicesData} scrollToSection={scrollToSection} />
      <TestimonialsSection testimonialsData={testimonialsData} />
      <ContactSection servicesData={servicesData} />
      <Footer heroData={heroData} servicesData={servicesData} scrollToSection={scrollToSection} />
    </div>
  );
}
