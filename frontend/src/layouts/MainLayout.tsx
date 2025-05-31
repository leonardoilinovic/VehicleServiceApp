import React from "react";
import NavBar from "../components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
  {/* Background gradient layer */}
  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-r from-sky-400 to-blue-700 rounded-bl-[60px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] ring-1 ring-white/10 backdrop-blur-md z-0" />

  
  {/* Fade-to-white at the bottom */}
  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-0" />

  {/* Navigation bar */}
  <NavBar />

      {/* Content above background */}
      <main className="relative z-10 px-4 sm:px-8 lg:px-16 pt-32 transition-all duration-500 ease-in-out">

        {children}
      </main>
    </div>
  );
};

export default MainLayout;