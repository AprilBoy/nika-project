import { ContactForm } from "@/components/contact-form";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="container px-6 md:px-12 max-w-8xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
            Готовы начать работу?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Расскажите о вашем проекте, и мы обсудим, как я могу помочь вам достичь целей
          </p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
