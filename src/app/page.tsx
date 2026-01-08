import React from "react";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import Welcome from "@/components/Home/Welcome";
import Mentor from "@/components/Home/Mentor";
import Testimonial from "@/components/Home/Testimonials";
import Newsletter from "@/components/Home/Newsletter";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "KwaZulu Natal Matric Excellence",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Welcome />
      <Mentor />
      {/* <Testimonial /> */}
      <Newsletter />
    </main>
  );
}