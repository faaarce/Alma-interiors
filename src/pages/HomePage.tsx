import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Services from "../components/Services";
import Process from "../components/Process";
import Reviews from "../components/Reviews";
import VideoTestimonial from "../components/VideoTestimonial";
import Contact from "../components/Contact";

export default function HomePage() {
  return (
    <div className="font-sans">
      <Header
        navLinks={[
          { label: "Works", href: "/work" },
          { label: "Teams", href: "/teams" },
          { label: "Blog", href: "/blog" },
          { label: "Contact", href: "/#contact" },
        ]}
        ctaLabel="Book"
        lightSections={["about", "projects", "services", "reviews", "contact"]}
      />
      <Hero heading="Design<br />& Build" subheading="Interior Design & Custom Furniture dengan desain modern dan rapi sesuai kebutuhan anda." ctaLabel="Book A Consultation" backgroundImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop" />
      <About />
      <Projects />
      <Services />
      <Process />
      <Reviews />
      <VideoTestimonial />
      <Contact />
    </div>
  );
}
