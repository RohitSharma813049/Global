import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScholarReviewsCarousel from "@/components/scholars/ScholarReviewsCarousel";

export default function ScholarReviewsPage() {
  return (
    <>
      <ScholarReviewsCarousel />
      <Footer />
    </>
  );
}
