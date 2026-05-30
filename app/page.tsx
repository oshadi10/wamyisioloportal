"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/school/navbar";
import { StudentLogin, StaffLogin } from "@/components/school/login-forms";
import { StudentPortal } from "@/components/school/student-portal";
import { StaffPortal } from "@/components/school/staff-portal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import {
  Lecturer,
  Result,
  FeeRecord,
  initializeFees,
  studentAccounts,
  getStudentClass,
} from "@/lib/school-data";

type ViewType = "home" | "student-login" | "staff-login" | "student-portal" | "staff-portal";
// Add this near your other useState hooks at the top of SchoolPortal()
const heroSlides = [
  {
    title: "WAMY Isiolo High School",
    subtitle: "Excellence Through Education, Discipline & Leadership. Nurturing future leaders through quality education, Islamic values and holistic development.",
    image: "/sports.jpg",
  },
  {
    title: "Academic Excellence",
    subtitle: "Offering 11 subjects including Mathematics, Sciences, Languages and more. Empowering students with knowledge for a brighter future.",
    image: "/scouts.jpg",
  },
  {
    title: "Holistic Development",
    subtitle: "Sports, Scouts, First Aid and outdoor activities build character, teamwork and resilience in every student.",
    image: "/outdoor.jpg",
  },
  {
    title: "Islamic Values & Leadership",
    subtitle: "Grounded in faith and discipline, we produce graduates ready for success in this world and the hereafter.",
    image: "/firstaid.jpg",
  },
];

export default function SchoolPortal() {
  const [heroIndex, setHeroIndex] = useState(0);
const [heroFade, setHeroFade] = useState(true);

useEffect(() => {
  const interval = setInterval(() => {
    setHeroFade(false);
    setTimeout(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
      setHeroFade(true);
    }, 500);
  }, 4000);
  return () => clearInterval(interval);
}, []);

  const [view, setView] = useState<ViewType>("home");
  const [currentPage, setCurrentPage] = useState("Home");
  const [loggedInStudent, setLoggedInStudent] = useState<string | null>(null);
  const [loggedInLecturer, setLoggedInLecturer] = useState<Lecturer | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [fees, setFees] = useState<Record<string, FeeRecord>>(initializeFees);
  const [materials, setMaterials] = useState<any[]>([]);
  const [timetables, setTimetables] = useState<any[]>([]);
  const [termDates, setTermDates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchResults();
    fetchMaterials();
    fetchTimetables();
    fetchTermDates();
    fetchEvents();
    fetchFees();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error(error); return; }
    setEvents(data || []);
  };

  const handleUpdateMovingAnnouncement = async (newText: string) => {
    await supabase.from("events").delete().eq("type", "moving_announcement");
    const { error } = await supabase.from("events").insert({
      type: "moving_announcement",
      title: newText,
    });
    if (error) { console.error(error); return; }
    fetchEvents();
  };

  const fetchTermDates = async () => {
    try {
      const { data, error } = await supabase
        .from("term_dates")
        .select("*")
      
      if (error) { 
        console.error(error); 
        return; 
      }
      if (data) {
        setTermDates(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFees = async () => {
    const { data, error } = await supabase.from("fees").select("*");
    if (error) { console.error(error); return; }
    const feesMap: Record<string, { total: number; paid: number }> = {};
    (data || []).forEach((f: any) => {
      feesMap[f.student] = { total: f.total, paid: f.paid };
    });
    setFees((prev) => ({ ...prev, ...feesMap }));
  };

  const fetchMaterials = async () => {
    const { data, error } = await supabase.from("materials").select("*").order("created_at", { ascending: false });
    if (error) { console.error(error); return; }
    setMaterials(data || []);
  };

  const handlePostMaterial = async (material: any) => {
    const { error } = await supabase.from("materials").insert(material);
    if (error) { console.error(error); return; }
    fetchMaterials();
  };

  const handleDeleteMaterial = async (id: string) => {
    const { error } = await supabase.from("materials").delete().eq("id", id);
    if (error) { console.error(error); return; }
    fetchMaterials();
  };

  const fetchTimetables = async () => {
    const { data, error } = await supabase.from("timetables").select("*").order("created_at", { ascending: false });
    if (error) { console.error(error); return; }
    setTimetables(data || []);
  };

  const handleUploadTimetable = async (timetable: any) => {
    const { error } = await supabase.from("timetables").insert(timetable);
    if (error) { console.error(error); return; }
    fetchTimetables();
  };

  const handleDeleteTimetable = async (id: string) => {
    const { error } = await supabase.from("timetables").delete().eq("id", id);
    if (error) { console.error(error); return; }
    fetchTimetables();
  };

  const fetchResults = async () => {
    const { data, error } = await supabase.from("results").select("*");
    if (error) { console.error(error); return; }
    const mapped: Result[] = (data || []).map((r: any) => ({
      student: r.student,
      className: r.class_name,
      subject: r.subject,
      marks: r.marks,
      grade: r.grade,
      term: r.term,
    }));
    setResults(mapped);
  };

  const handleStudentLogin = (studentName: string) => {
    setLoggedInStudent(studentName);
    setView("student-portal");
  };

  const handleStaffLogin = (lecturer: Lecturer) => {
    setLoggedInLecturer(lecturer);
    setView("staff-portal");
  };

  const handleLogout = () => {
    setLoggedInStudent(null);
    setLoggedInLecturer(null);
    setView("home");
  };

  const handleUploadResult = async (result: Result) => {
    await supabase.from("results").delete().match({
      student: result.student,
      subject: result.subject,
      term: result.term,
    });
    const { error } = await supabase.from("results").insert({
      student: result.student,
      class_name: result.className,
      subject: result.subject,
      marks: result.marks,
      grade: result.grade,
      term: result.term,
    });
    if (error) { console.error(error); return; }
    fetchResults();
  };

  const handleDeleteResult = async (student: string, subject: string, term: string) => {
    const { error } = await supabase.from("results").delete().match({
      student,
      subject,
      term,
    });
    if (error) { console.error(error); return; }
    fetchResults();
  };

  const handleUpdateFees = async (student: string, total: number, paid: number) => {
    const { data } = await supabase.from("fees").select("id").eq("student", student).single();
    if (data) {
      await supabase.from("fees").update({ total, paid, updated_at: new Date().toISOString() }).eq("student", student);
    } else {
      await supabase.from("fees").insert({ student, total, paid });
    }
    fetchFees();
  };

  const handleUploadTermDate = async () => {
    fetchTermDates();
  };

  // FIX: This variable is now declared before any portal conditional returns
  const liveAnnouncement = events.find(e => e.type === "moving_announcement")?.title 
    || "📢 IDD-UL ADHA Break on 26th May, 2026. Wish you Idd Mubarak.";

  if (view === "student-portal" && loggedInStudent) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar
          isPortal
          portalType="student"
          userName={loggedInStudent}
          userDetails={`${getStudentClass(loggedInStudent)} - Adm: ${studentAccounts[loggedInStudent]}`}
          onLogout={handleLogout}
        />
        <StudentPortal
          studentName={loggedInStudent}
          results={results}
          fees={fees}
          materials={materials}
          timetables={timetables}
        />
      </main>
    );
  }

  if (view === "staff-portal" && loggedInLecturer) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar
          isPortal
          portalType="staff"
          userName={loggedInLecturer.name}
          userDetails={loggedInLecturer.subject}
          onLogout={handleLogout}
        />
        <StaffPortal
          lecturer={loggedInLecturer}
          results={results}
          fees={fees}
          materials={materials}
          timetables={timetables}
          onUploadResult={handleUploadResult}
          onDeleteResult={handleDeleteResult}
          onUpdateFees={handleUpdateFees}
          onPostMaterial={handlePostMaterial}
          onDeleteMaterial={handleDeleteMaterial}
          onUploadTimetable={handleUploadTimetable}
          onDeleteTimetable={handleDeleteTimetable}
          onUploadTermDate={handleUploadTermDate}
          currentAnnouncement={liveAnnouncement}
          onUpdateAnnouncement={handleUpdateMovingAnnouncement}
        />
      </main>
    );
  }

  if (view === "student-login") {
    return (
      <main className="min-h-screen bg-background">
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onStudentPortal={() => setView("student-login")}
          onStaffPortal={() => setView("staff-login")}
        />
        <StudentLogin onLogin={handleStudentLogin} onBack={() => setView("home")} />
      </main>
    );
  }

  if (view === "staff-login") {
    return (
      <main className="min-h-screen bg-background">
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onStudentPortal={() => setView("student-login")}
          onStaffPortal={() => setView("staff-login")}
        />
        <StaffLogin onLogin={handleStaffLogin} onBack={() => setView("home")} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      
      {/* DYNAMIC SEAMLESS MOVING ANNOUNCEMENT BANNER */}
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
            padding-left: 100%;
            animation: marquee-seamless 15s linear infinite;
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

      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onStudentPortal={() => setView("student-login")}
        onStaffPortal={() => setView("staff-login")}
      />

    {/* HERO SECTION */}
<section className="relative text-white overflow-hidden">
  <div className="absolute inset-0 z-0">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url('${heroSlides[heroIndex].image}')`,
        transition: "background-image 0.5s ease",
        opacity: heroFade ? 1 : 0,
        transitionProperty: "opacity",
        transitionDuration: "0.5s",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-green-900/80 to-green-700/80" />
  </div>
  <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 text-center">

    {/* Animated text block */}
    <div
      style={{
        transition: "opacity 0.5s ease, transform 0.5s ease",
        opacity: heroFade ? 1 : 0,
        transform: heroFade ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <h1 className="text-5xl font-bold mb-6">{heroSlides[heroIndex].title}</h1>
      <p className="text-xl max-w-3xl mx-auto mb-8 text-gray-200">
        {heroSlides[heroIndex].subtitle}
      </p>
    </div>

    {/* Dot indicators */}
    <div className="flex justify-center gap-2 mb-6">
      {heroSlides.map((_, i) => (
        <button
          key={i}
          onClick={() => { setHeroFade(false); setTimeout(() => { setHeroIndex(i); setHeroFade(true); }, 500); }}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            i === heroIndex ? "bg-white scale-125" : "bg-white/40"
          }`}
        />
      ))}
    </div>

    <div className="flex flex-col md:flex-row justify-center gap-4">
      <button onClick={() => setView("student-login")} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors">
        Student Portal
      </button>
      <button onClick={() => setView("staff-login")} className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold shadow-lg transition-colors">
        Staff Portal
      </button>
    </div>
  </div>
</section>
      
      {currentPage === "Home" && (
        <>
          {/* WELCOME SECTION */}
          <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <h2 className="text-4xl font-bold text-blue-900 mb-6">Welcome to WAMY Isiolo High School</h2>
              <p className="text-gray-700 text-lg leading-8 max-w-4xl mx-auto">
                WAMY Isiolo High School is dedicated to academic excellence, discipline, innovation and character building. We provide quality education in a supportive Islamic environment that empowers students to succeed academically and morally.
              </p>
            </div>
          </section>

          {/* MAIN CONTENT + SIDEBAR */}
          <section className="max-w-6xl mx-auto px-6 pb-12">
            <div className="flex flex-col lg:flex-row gap-6">

              {/* LEFT MAIN CONTENT */}
              <div className="flex-1 space-y-6">

                {/* TERM CALENDAR */}
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                    <AlertCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">Current Session Notification</p>
                      <p className="text-xs text-emerald-700">
                        Currently operating in <strong>Term 2, 2026</strong>. Track timelines in the calendar below.
                      </p>
                    </div>
                  </div>
                  <Card className="shadow-lg border border-slate-200 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b pb-4 pt-5 px-6">
                      <CardTitle className="text-lg font-bold flex items-center gap-2 text-blue-950">
                        <CalendarIcon className="h-5 w-5 text-blue-800" />
                        Official School Calendar & Term Dates — 2026
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                      <div className="overflow-x-auto rounded-lg border border-slate-100">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                              <TableHead className="font-bold text-slate-900 text-center h-11">Opening Date</TableHead>
                              <TableHead className="font-bold text-slate-900 text-center h-11">IDD Break</TableHead>
                              <TableHead className="font-bold text-slate-900 text-center h-11">Mid-Term Exam</TableHead>
                              <TableHead className="font-bold text-slate-900 text-center h-11">Mid-Term Break</TableHead>
                              <TableHead className="font-bold text-slate-900 text-center h-11">End-Term Exam</TableHead>
                              <TableHead className="font-bold text-slate-900 text-center h-11">Closing Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {termDates && termDates.length > 0 && termDates[0] ? (
                              <TableRow className="bg-blue-50/40 text-center font-medium hover:bg-blue-50/60 transition-colors">
                                <TableCell className="py-4 font-bold text-slate-900">{termDates[0].opening_date || "—"}</TableCell>
                                <TableCell className="py-4 text-amber-800 font-semibold">{termDates[0].idd_date || "—"}</TableCell>
                                <TableCell className="py-4 text-slate-700">{termDates[0].midterm_exam || "—"}</TableCell>
                                <TableCell className="py-4 text-blue-800 font-semibold">{termDates[0].mid_term || "—"}</TableCell>
                                <TableCell className="py-4 text-slate-700">{termDates[0].end_term_exam || "—"}</TableCell>
                                <TableCell className="py-4 font-bold text-emerald-800">{termDates[0].closing_date || "—"}</TableCell>
                              </TableRow>
                            ) : (
                              <TableRow>
                                <td colSpan={6} className="text-center py-6 text-sm text-muted-foreground italic">
                                  Loading academic calendar...
                                </td>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center"><h3 className="text-4xl font-bold text-blue-700 mb-1">69+</h3><p className="text-gray-600 font-semibold text-sm">Students</p></div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center"><h3 className="text-4xl font-bold text-green-700 mb-1">8</h3><p className="text-gray-600 font-semibold text-sm">Staff Members</p></div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center"><h3 className="text-4xl font-bold text-yellow-600 mb-1">3</h3><p className="text-gray-600 font-semibold text-sm">Classes</p></div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center"><h3 className="text-4xl font-bold text-red-600 mb-1">100%</h3><p className="text-gray-600 font-semibold text-sm">Discipline</p></div>
                </div>

              </div>

              {/* RIGHT SIDEBAR — sticky so it stays visible while scrolling */}
              <div className="w-full lg:w-80 space-y-4 lg:sticky lg:top-4 lg:self-start">

                {/* ANNOUNCEMENTS */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="bg-blue-700 px-4 py-3">
                    <h3 className="text-white font-bold text-sm">📢 Announcements</h3>
                  </div>
                  <div className="divide-y max-h-52 overflow-y-auto">
                    {events.filter(e => e.type === "announcement").length === 0 ? (
                      <p className="text-xs text-gray-400 italic p-4">No announcements yet.</p>
                    ) : events.filter(e => e.type === "announcement").map(e => (
                      <div key={e.id} className="p-3">
                        <p className="text-sm font-semibold text-slate-800">{e.title}</p>
                        {e.description && <p className="text-xs text-gray-500 mt-0.5">{e.description}</p>}
                        {e.date && <p className="text-xs text-blue-600 mt-1">📅 {e.date}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* UPCOMING EVENTS */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="bg-emerald-600 px-4 py-3">
                    <h3 className="text-white font-bold text-sm">🗓️ Upcoming Events</h3>
                  </div>
                  <div className="divide-y max-h-52 overflow-y-auto">
                    {events.filter(e => e.type === "event").length === 0 ? (
                      <p className="text-xs text-gray-400 italic p-4">No upcoming events.</p>
                    ) : events.filter(e => e.type === "event").map(e => (
                      <div key={e.id} className="p-3">
                        <p className="text-sm font-semibold text-slate-800">{e.title}</p>
                        {e.description && <p className="text-xs text-gray-500 mt-0.5">{e.description}</p>}
                        {e.date && <p className="text-xs text-emerald-600 mt-1">📅 {e.date}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* SCHOOL NOTICES */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="bg-amber-500 px-4 py-3">
                    <h3 className="text-white font-bold text-sm">📋 School Notices</h3>
                  </div>
                  <div className="divide-y max-h-52 overflow-y-auto">
                    {events.filter(e => e.type === "notice").length === 0 ? (
                      <p className="text-xs text-gray-400 italic p-4">No notices posted.</p>
                    ) : events.filter(e => e.type === "notice").map(e => (
                      <div key={e.id} className="p-3">
                        <p className="text-sm font-semibold text-slate-800">{e.title}</p>
                        {e.description && <p className="text-xs text-gray-500 mt-0.5">{e.description}</p>}
                        {e.date && <p className="text-xs text-amber-600 mt-1">📅 {e.date}</p>}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SCHOOL LIFE ACTIVITIES */}
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">School Life & Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src="/sports.jpg" alt="Sports & Teamwork" className="w-full h-72 object-cover" />
                <div className="p-6"><h3 className="text-2xl font-bold mb-3">Sports & Teamwork</h3><p className="text-gray-600">Building discipline, teamwork and leadership through sports.</p></div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src="/scouts.jpg" alt="Scouts Movement" className="w-full h-72 object-cover" />
                <div className="p-6"><h3 className="text-2xl font-bold mb-3">Scouts Movement</h3><p className="text-gray-600">Training responsible students with leadership skills and character.</p></div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src="/outdoor.jpg" alt="Outdoor Activities" className="w-full h-72 object-cover" />
                <div className="p-6"><h3 className="text-2xl font-bold mb-3">Outdoor Activities</h3><p className="text-gray-600">Fostering resilience and teamwork through outdoor programs.</p></div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src="/firstaid.jpg" alt="First Aid Training" className="w-full h-72 object-cover" />
                <div className="p-6"><h3 className="text-2xl font-bold mb-3">First Aid Training</h3><p className="text-gray-600">Equipping students with life-saving skills and emergency preparedness.</p></div>
              </div>
            </div>
          </section>

          {/* LEADERSHIP MESSAGE */}
          <section className="bg-blue-950 text-white py-20">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-8">Message from the Principal</h2>
              <p className="text-xl leading-9 text-gray-200">"At WAMY Isiolo High School, we believe in nurturing students academically, morally and spiritually. Our mission is to produce disciplined future leaders prepared for success in this world and the hereafter."</p>
              <div className="mt-8 text-yellow-400 font-bold text-xl">— Principal Osman Halake</div>
            </div>
          </section>
        </>
      )}

      {currentPage === "About Us" && (
        <section className="max-w-4xl mx-auto px-6 py-16 space-y-6">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-10">About Us</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-green-700 mb-3">🌿 Our Mission</h3>
            <p className="text-gray-600 leading-8">To provide quality, inclusive, and values-based education that equips students with academic excellence, strong character, and life skills necessary to thrive in a dynamic world.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-green-700 mb-3">🎯 Our Vision</h3>
            <p className="text-gray-600 leading-8">To be a leading institution in Isiolo County that produces responsible, knowledgeable, and faith-grounded graduates who contribute positively to society.</p>
          </div>
        </section>
      )}

      {currentPage === "Academics" && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">Academic Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["Mathematics","English","Kiswahili","Physics","Chemistry","Biology","History","Arabic / IRE","Business Studies","Agriculture","Literature"].map((s) => (
              <div key={s} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <p className="font-semibold text-gray-800">{s}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {currentPage === "Downloads" && (
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">Downloads</h2>
          <div className="space-y-4">
            {[
              {icon:"📋", title:"School Fee Structure 2025/2026", sub:"PDF — Updated January 2025"},
              {icon:"📝", title:"Admission Form", sub:"PDF — New Student Registration"},
              {icon:"📅", title:"2026 School Calendar", sub:"PDF — Term dates & holidays"},
            ].map((d) => (
              <div key={d.title} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
                <span className="text-3xl">{d.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{d.title}</p>
                  <p className="text-sm text-gray-500">{d.sub}</p>
                </div>
                <button onClick={()=>alert("Contact school administration for this document.")} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Download</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="bg-black text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">WAMY Isiolo High School</h3>
          <p>Email: info@wamyisiolo.sc.ke</p>
          <p>Isiolo, Kenya</p>
          <div className="mt-6 text-sm text-gray-500">© 2026 WAMY Isiolo High School. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
