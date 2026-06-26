"use client";

import React, { useEffect } from "react";
import Footer from "@/components/layout/footer";
import AboutHero from "@/components/about/AboutHero";
import VisionMission from "@/components/about/VisionMission";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import OurProcess from "@/components/about/OurProcess";

export default function About() {
  useEffect(() => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), i * 70);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <>
      <AboutHero />
      <VisionMission />
      <WhyChooseUs />
      <OurProcess />
      <Footer />
    </>
  );
}
