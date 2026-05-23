"use client";

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
  // Dynamic announcement banner properties passed from main portal layout
  liveAnnouncement?: string;
}

const navItems = [
  { name: "Home", icon: Home },
  { name: "About Us", icon: Info },
  { name: "Academics", icon: BookOpen },
  { name: "Downloads", icon: Download },
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
  liveAnnouncement, // Read the string text parameter values smoothly
}: NavbarProps) {
  return (
    <header>
      {/* DYNAMIC SEAMLESS MOVING ANNOUNCEMENT BANNER */}
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

      {/* PRIMARY SCHOOL HEADLINE BLOCK */}
      <div className="bg-[#1e3a5f] text-white px-6 py-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-medium">Wamy Isiolo High School</h1>
            <p className="text-xs text-white/70">
              {isPortal ? (portalType === "student" ? "Student Portal" : "Staff Portal") : "Excellence In Education"}
            </p>
          </div>
        </div>
      </div>

      {/* PORTAL NAVIGATION AND CONTEXT ACTION BAR LAYOUT PANELS */}
      {isPortal ? (
        <div className="bg-[#2d4e6f] px-6 py-3 flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-white/70">{userDetails}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      ) : (
        <nav className="bg-[#2d4e6f] flex flex-wrap items-center">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => onNavigate?.(item.name)}
              className={`px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors ${
                currentPage === item.name ? "bg-white/10" : ""
              }`}
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={onStudentPortal}
            className="px-4 py-2.5 text-sm text-white bg-[#1a56a0] hover:bg-[#154a8a] transition-colors flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Student Portal
          </button>
          <button
            onClick={onStaffPortal}
            className="px-4 py-2.5 text-sm text-white bg-[#146f3a] hover:bg-[#0f5a2e] transition-colors flex items-center gap-2"
          >
            <GraduationCap className="h-4 w-4" />
            Staff Portal
          </button>
        </nav>
      )}
    </header>
  );
}
