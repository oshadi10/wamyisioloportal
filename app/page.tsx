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

export default function SchoolPortal() {
  const [view, setView] = useState<ViewType>("home");
  const [currentPage, setCurrentPage] = useState("Home");
  const [loggedInStudent, setLoggedInStudent] = useState<string | null>(null);
  const [loggedInLecturer, setLoggedInLecturer] = useState<Lecturer | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [fees, setFees] = useState<Record<string, FeeRecord>>(initializeFees);
  const [materials, setMaterials] = useState<any[]>([]);
  const [timetables, setTimetables] = useState<any[]>([]);
  
  // State for dynamic term dates
  const [termDates, setTermDates] = useState<any[]>([]);

  useEffect(() => {
    fetchResults();
    fetchMaterials();
    fetchTimetables();
    fetchTermDates();
  }, []);

  const fetchTermDates = async () => {
    const { data, error } = await supabase
      .from("term_dates")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (error) { 
      console.error(error); 
      return; 
    }
    if (data) {
      setTermDates(data);
    }
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

  const handleUpdateFees = (student: string, total: number, paid: number) => {
    setFees((prev) => ({
      ...prev,
      [student]: { total, paid },
    }));
  };

  const handleUploadTermDate = async (newTermRow: any) => {
    const { error } = await supabase.from("term_dates").insert(newTermRow);
    if (error) {
      console.error(error);
      alert("Failed to save term dates.");
      return;
    }
    fetchTermDates();
  };

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
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onStudentPortal={() => setView("student-login")}
        onStaffPortal={() => setView("staff-login")}
      />

      {/* HERO SECTION */}
      <section className="relative text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {["/sports.jpg", "/scouts.jpg", "/outdoor.jpg", "/firstaid.jpg"].map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${img})`,
                animation: `slide ${32}s infinite`,
                animationDelay: `${i * 8}s`,
                opacity: 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-green-900/80 to-green-700/80" />
        </div>
        <style>{`
          @keyframes slide {
            0%, 20% { opacity: 1; }
            25%, 100% { opacity: 0; }
          }
        `}</style>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">WAMY Isiolo High School</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 text-gray-200">
            Excellence Through Education, Discipline & Leadership.
            Nurturing future leaders through quality education,
            Islamic values and holistic development.
          </p>
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

          {/* DYNAMIC TERM CALENDAR SECTION */}
          <section className="max-w-6xl mx-auto px-6 pb-12">
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <AlertCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Current Session Notification</p>
                  <p className="text-xs text-emerald-700">
                    The school system is currently operating in <strong className="font-bold">Term 2, 2026</strong>. Please track the internal timelines outlined in the visual calendar table below.
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
                              Loading academic calendar dates from database...
                            </td>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* STATS COUNTER SECTION */}
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center"><h3 className="text-5xl font-bold text-blue-700 mb-2">69+</h3><p className="text-gray-600 font-semibold">Students</p></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center"><h3 className="text-5xl font-bold text-green-700 mb-2">8</h3><p className="text-gray-600 font-semibold">Staff Members</p></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center"><h3 className="text-5xl font-bold text-yellow-600 mb-2">3</h3><p className="text-gray-600 font-semibold">Classes</p></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center"><h3 className="text-5xl font-bold text-red-600 mb-2">100%</h3><p className="text-gray-600 font-semibold">Discipline</p></div>
            </div>
          </section>

          {/* SCHOOL LIFE ACTIVITIES SECTION */}
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">School Life & Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src="/sports.jpg" alt="Sports" className="w-full h-72 object-cover" />
                <div className="p-6"><h3 className="text-2xl font-bold mb-3">Sports & Teamwork</h3><p className="text-gray-600">Building discipline, teamwork and leadership through sports.</p></div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src="/scouts.jpg" alt="Scouts" className="w-full h-72 object-cover" />
                <div className="p-6"><h3 className="text-2xl font-bold mb-3">Scouts Movement</h3><p className="text-gray-600">Training responsible students with leadership skills and character.</p></div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src="/outdoor.jpg" alt="Jamboree" className="w-full h-72 object-cover" />
                <div className="p-6"><h3 className="text-2xl font-bold mb-3">Scouting Jamboree</h3><p className="text-gray-600">Students showcasing practical skills at inter-school camps.</p></div>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src="/firstaid.jpg" alt="Certificates" className="w-full h-72 object-cover" />
                <div className="p-6"><h3 className="text-2xl font-bold mb-3">Certificates of Participation</h3><p className="text-gray-600">Recognizing student achievement and hard work.</p></div>
              </div>
            </div>
          </section>

          {/* LEADERSHIP MESSAGE SECTION */}
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
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-green-700 mb-3">🏫 About the School</h3>
            <p className="text-gray-600 leading-8">WAMY Isiolo High School (World Assembly of Muslim Youth — Isiolo) is a Day and Boarding senior school in Isiolo County, Kenya. We offer STEM, Social Sciences, and Islamic classes with over 69 students, 8 dedicated staff members, and 3 classes.</p>
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
              {icon:"📋", title:"School Fee Structure 2024/2025", sub:"PDF — Updated January 2025"},
              {icon:"📝", title:"Admission Form", sub:"PDF — New Student Registration"},
              {icon:"📅", title:"2025 School Calendar", sub:"PDF — Term dates & holidays"},
              {icon:"📜", title:"School Rules & Regulations", sub:"PDF — Student Handbook"},
              {icon:"🩺", title:"Medical / Health Form", sub:"PDF — Required for boarding students"},
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
