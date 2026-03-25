import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import HeroSection from "../components/shared/HeroSection";
import StatsSection from "../components/shared/StatsSection";
import AboutSection from "../components/shared/AboutSection";
import SpecialitiesSection from "../components/shared/SpecialitiesSection";
import EmergencySection from "../components/shared/EmergencySection";
import HomeCareSection from "../components/shared/HomeCareSection";
import ChairmanSection from "../components/shared/ChairmanSection";
import SupportSection from "../components/shared/SupportSection";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow">

        <HeroSection />
        <StatsSection />
        <AboutSection />
        <SpecialitiesSection />
        <EmergencySection />
        <HomeCareSection />
        <ChairmanSection />
        <SupportSection />

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;