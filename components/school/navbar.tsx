"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Users, LogOut, BookOpen, Home, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isPortal?: boolean;
  portalType?: "student" | "staff";
  userName?: string;
  userDetails?: string;
  onLogout?: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onStudentPortal?: () => void;
  onStaffPortal?: () => void;
  liveAnnouncement?: string;
}

const navItems = [
  { name: "Home", icon: Home },
  { name: "About Us", icon: Info },
  { name: "Academics", icon: BookOpen },
  { name: "Downloads", icon: Download },
];

// Mock background photos for the hero image cycle switcher
const sliderImages = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200"
];

export function Navbar({
  isPortal = false,
  portalType,
  userName,
  userDetails,
  onLogout,
  currentPage,
  onNavigate,
  onStudentPortal,
  onStaffPortal,
  liveAnnouncement,
}: NavbarProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background Image Cycle Slider Timer
  useEffect(() => {
    if (isPortal) return; // Only cycle background photos on the public website layout
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000); // Transitions to a new image every 5 seconds
    return () => clearInterval(interval);
  }, [isPortal]);

  return (
    <header className="relative w-full overflow-hidden">
      {/* 1. DYNAMIC SEAMLESS MOVING ANNOUNCEMENT BANNER */}
      {liveAnnouncement && (
        <div className="w-full bg-amber-400 text-slate-950 font-bold py-2 overflow-hidden relative shadow-sm z-50 select-none flex">
          <style>{`
            @keyframes marquee-seamless {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-100%); }
            }
            .marquee-container {
              display: flex;
              white-space: nowrap;
              min-width: 100%;
            }
            .animate-marquee-loop {
              display: flex;
              flex-shrink: 0;
              align-items: center;
              animation: marquee-seamless 25s linear infinite;
            }
            .marquee-container:hover .animate-marquee-loop {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="marquee-container cursor-pointer text-sm md:text-base">
            <div className="animate-marquee-loop pr-16">
              {liveAnnouncement}
            </div>
            <div className="animate-marquee-loop pr-16" aria-hidden="true">
              {liveAnnouncement}
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN BRANDING HEADER & HERO BACKGROUND SECTION */}
      <div className="relative w-full min-h-[160px] md:min-h-[200px] flex items-center justify-between px-6 md:px-12 py-6 overflow-hidden bg-slate-900">
        
        {/* Background Image Layer (Public Site handles sliding carousels; Portal falls back to solid tint) */}
        {!isPortal ? (
          <div className="absolute inset-0 w-full h-full z-0">
            {sliderImages.map((imgUrl, index) => (
              <div
                key={imgUrl}
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url('${imgUrl}')`,
                  opacity: currentSlide === index ? 1 : 0,
                }}
              />
            ))}
            {/* Elegant deep green overlay tint ensuring textual legibility across contrasting photo changes */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#112a47]/95 via-[#1e3a5f]/90 to-[#144227]/75 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#1e3a5f] z-0" /> // Clean corporate fallback for student/staff internal layouts
        )}

        {/* School Crest, Heading Texts, and Core Brand Values */}
        <div className="flex items-center gap-5 z-10 relative max-w-2xl text-white">
          <div className="relative group">
            <img 
              src="/wamy logggo.png" 
              alt="Wamy Isiolo High School Logo" 
              className="h-16 w-auto object-contain rounded-xl bg-white/10 p-1.5 backdrop-blur-sm shadow-md border border-white/10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallbackIcon = document.getElementById('navbar-fallback-icon');
                if (fallbackIcon) fallbackIcon.style.display = 'block';
              }}
            />
            <div id="navbar-fallback-icon" style={{ display: 'none' }}>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <GraduationCap className="h-9 w-9 text-white" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide drop-shadow-md bg-clip-text bg-gradient-to-b from-white to-slate-200">
              Wamy Isiolo High School
            </h1>
            <p className="text-xs md:text-sm font-medium tracking-wider text-amber-300 drop-shadow mt-0.5 uppercase">
              {isPortal ? (portalType === "student" ? "🌟 Student Portal" : "💼 Staff Portal") : "Excellence Through Education, Discipline & Leadership"}
            </p>
          </div>
        </div>

        {/* Modern Curvetured Secondary Image Mask Cut-Out Frame */}
        {!isPortal && (
          <div 
            className="hidden lg:block absolute right-0 top-0 bottom-0 w-[35%] h-full bg-cover bg-center shadow-2xl transition-all duration-700 ease-in-out border-l border-white/10"
            style={{
              backgroundImage: `url('${sliderImages[(currentSlide + 1) % sliderImages.length]}')`,
              clipPath: "ellipse(95% 100% at 100% 50%)",
            }}
          />
        )}
      </div>

      {/* 3. PORTAL NAVIGATION AND CONTEXT ACTION BAR LAYOUT PANELS */}
      {isPortal ? (
        <div className="bg-[#2d4e6f] border-t border-white/10 px-6 py-3 flex items-center justify-between relative z-20 shadow-md">
          <div className="text-white">
            <p className="text-sm font-semibold tracking-wide">{userName}</p>
            <p className="text-xs text-slate-300/90 font-medium">{userDetails}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-white hover:bg-white/10 hover:text-white border border-white/5 transition-all"
          >
            <LogOut className="h-4 w-4 mr-2 text-rose-400" />
            Logout
          </Button>
        </div>
      ) : (
        <nav className="bg-[#2d4e6f] border-t border-white/10 flex flex-wrap items-center relative z-20 shadow-md">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => onNavigate?.(item.name)}
              className={`px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all ${
                currentPage === item.name ? "bg-white/10 border-b-2 border-amber-400 font-bold" : ""
              }`}
            >
              {item.name}
            </button>
          ))}
          <div className="flex items-center ml-auto flex-wrap">
            <button
              onClick={onStudentPortal}
              className="px-5 py-3 text-sm font-bold text-white bg-[#1a56a0] hover:bg-[#154a8a] active:bg-[#113d73] transition-colors flex items-center gap-2 border-l border-white/5"
            >
              <Users className="h-4 w-4 text-amber-300" />
              Student Portal
            </button>
            <button
              onClick={onStaffPortal}
              className="px-5 py-3 text-sm font-bold text-white bg-[#146f3a] hover:bg-[#0f5a2e] active:bg-[#0b4422] transition-colors flex items-center gap-2 border-l border-white/5"
            >
              <GraduationCap className="h-4 w-4 text-amber-300" />
              Staff Portal
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
