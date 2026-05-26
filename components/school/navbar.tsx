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

// 1. BUNDLE YOUR PICTURES WITH SPECIFIC INFORMATION HERE
const sliderData = [
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200",
    title: "Wamy Isiolo High School",
    subtitle: "Excellence Through Education, Discipline & Leadership. Nurturing future leaders through Islamic values."
  },
  {
    image: "scouts.jpg",
    title: "Admissions Are Ongoing!",
    subtitle: "Join our vibrant academic community for the 2026 academic year. Secure your child's future today."
  },
  {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200",
    title: "Modern Science Laboratories",
    subtitle: "Equipping students with practical, hands-on skills in Chemistry, Physics, and Biology."
  }
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
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycles both text and image simultaneously every 6 seconds
  useEffect(() => {
    if (isPortal) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPortal]);

  return (
    <header className="relative w-full overflow-hidden">
      {/* SEAMLESS MOVING ANNOUNCEMENT BANNER */}
      {liveAnnouncement && (
        <div className="w-full bg-amber-400 text-slate-950 font-bold py-2 overflow-hidden relative shadow-sm z-50 select-none flex">
          <style>{`
            @keyframes marquee-seamless {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-100%); }
            }
            .marquee-container { display: flex; white-space: nowrap; min-width: 100%; }
            .animate-marquee-loop { display: flex; flex-shrink: 0; align-items: center; animation: marquee-seamless 25s linear infinite; }
            .marquee-container:hover .animate-marquee-loop { animation-play-state: paused; }
          `}</style>
          <div className="marquee-container cursor-pointer text-sm md:text-base">
            <div className="animate-marquee-loop pr-16">{liveAnnouncement}</div>
            <div className="animate-marquee-loop pr-16" aria-hidden="true">{liveAnnouncement}</div>
          </div>
        </div>
      )}

      {/* PRIMARY HERO BANNER WITH SYNCED CONTENT */}
      <div className="relative w-full min-h-[220px] md:min-h-[260px] flex items-center justify-between px-6 md:px-12 py-8 overflow-hidden bg-slate-900">
        
        {/* Dynamic Background Image Layers */}
        {!isPortal ? (
          <div className="absolute inset-0 w-full h-full z-0">
            {sliderData.map((slide, index) => (
              <div
                key={slide.image}
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url('${slide.image}')`,
                  opacity: currentIndex === index ? 1 : 0,
                }}
              />
            ))}
            {/* Dark green/blue tint layer to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#112a47]/95 via-[#1e3a5f]/90 to-[#144227]/80 mix-blend-multiply" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#1e3a5f] z-0" />
        )}

        {/* Brand Crest + DYNAMIC Changing Text Content */}
        <div className="flex items-start gap-5 z-10 relative max-w-2xl text-white">
          <img 
            src="/wamy logggo.png" 
            alt="Logo" 
            className="h-16 w-auto object-contain rounded-xl bg-white/10 p-1.5 backdrop-blur-sm mt-1"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          {/* Text transitions fluidly alongside the active index state */}
          <div className="transition-all duration-500 ease-in-out">
            {isPortal ? (
              <>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">Wamy Isiolo High School</h1>
                <p className="text-sm font-medium text-amber-300 mt-1 uppercase">
                  {portalType === "student" ? "🌟 Student Portal" : "💼 Staff Portal"}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide drop-shadow-md animate-fadeIn">
                  {sliderData[currentIndex].title}
                </h1>
                <p className="text-xs md:text-sm text-slate-200 mt-2 max-w-xl leading-relaxed drop-shadow-sm">
                  {sliderData[currentIndex].subtitle}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Modern Curved Image Cut-Out (Shows the NEXT slide's image ahead of time) */}
        {!isPortal && (
          <div 
            className="hidden lg:block absolute right-0 top-0 bottom-0 w-[35%] h-full bg-cover bg-center shadow-2xl transition-all duration-1000 ease-in-out border-l border-white/10"
            style={{
              backgroundImage: `url('${sliderData[(currentIndex + 1) % sliderData.length].image}')`,
              clipPath: "ellipse(95% 100% at 100% 50%)",
            }}
          />
        )}
      </div>

      {/* PORTAL NAVIGATION AND ACTION BAR */}
      {isPortal ? (
        <div className="bg-[#2d4e6f] border-t border-white/10 px-6 py-3 flex items-center justify-between relative z-20 shadow-md">
          <div className="text-white">
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-slate-300">{userDetails}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2 text-rose-400" /> Logout
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
            <button onClick={onStudentPortal} className="px-5 py-3 text-sm font-bold text-white bg-[#1a56a0] hover:bg-[#154a8a] flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-300" /> Student Portal
            </button>
            <button onClick={onStaffPortal} className="px-5 py-3 text-sm font-bold text-white bg-[#146f3a] hover:bg-[#0f5a2e] flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-amber-300" /> Staff Portal
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
