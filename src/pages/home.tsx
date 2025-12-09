import { Navigation } from "@/components/navigation";
import { useDatabaseData } from "@/hooks/useDatabaseData";
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
    projectsData,
    loading
  } = useDatabaseData();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };


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
      <ContactSection />
      <Footer heroData={heroData} servicesData={servicesData} scrollToSection={scrollToSection} />
    </div>
  );
}
