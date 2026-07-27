import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Visit from "@/components/Visit";
import Footer from "@/components/Footer";
import StickyBookBar from "@/components/StickyBookBar";

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <Visit />
      </main>

      <Footer />
      <StickyBookBar />
    </>
  );
}
