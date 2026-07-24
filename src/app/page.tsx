"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import NewCollection from "@/components/home/NewCollection";
import ShopByCollection from "@/components/home/ShopByCollection";
import FeaturedEditorial from "@/components/home/FeaturedEditorial";
import BestSellers from "@/components/home/BestSellers";
import SignatureFabrics from "@/components/home/SignatureFabrics";
import SeasonalCampaign from "@/components/home/SeasonalCampaign";
import InstagramGallery from "@/components/home/InstagramGallery";
import CustomerReviews from "@/components/home/CustomerReviews";
import Newsletter from "@/components/home/Newsletter";
import { FloatingWhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NewCollection
          collectionSlug="linen-edit"
          eyebrow="Just Landed"
          title="The Linen Edit"
          description="Breathable European linen that softens with every wash — relaxed tailoring for the tropical climate."
        />
        <ShopByCollection />
        <FeaturedEditorial />
        <BestSellers />
        <SignatureFabrics />
        <SeasonalCampaign />
        <InstagramGallery />
        <CustomerReviews />
        <Newsletter />
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  );
}
