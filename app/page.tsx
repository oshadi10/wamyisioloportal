"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/school/navbar";
import { StudentLogin, StaffLogin } from "@/components/school/login-forms";
import { StudentPortal } from "@/components/school/student-portal";
import { StaffPortal } from "@/components/school/staff-portal";
import { HomeContent } from "@/components/school/home-content";
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

  useEffect(() => {
    fetchResults();
  }, []);

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
          onUploadResult={handleUploadResult}
          onDeleteResult={handleDeleteResult}
          onUpdateFees={handleUpdateFees}
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
            <button onClick={() => setView("student-login")} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg">
              Student Portal
            </button>
            <button onClick={() => setView("staff-login")} className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold shadow-lg">
              Staff Portal
            </button>
          </div>
        </div>
      </section>

      {currentPage === "Home" && (
        <>
          <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
              <h2 className="text-4xl font-bold text-blue-900 mb-6">Welcome to WAMY Isiolo High School</h2>
              <p className="text-gray-700 text-lg leading-8 max-w-4xl mx-auto">
                WAMY Isiolo High School is dedicated to academic excellence, discipline, innovation and character building. We provide quality education in a supportive Islamic environment that empowers students to succeed academically and morally.
              </p>
            </div>
          </section>
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center"><h3 className="text-5xl font-bold text-blue-700 mb-2">69+</h3><p className="text-gray-600 font-semibold">Students</p></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center"><h3 className="text-5xl font-bold text-green-700 mb-2">8</h3><p className="text-gray-600 font-semibold">Staff Members</p></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center"><h3 className="text-5xl font-bold text-yellow-600 mb-2">3</h3><p className="text-gray-600 font-semibold">Classes</p></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center"><h3 className="text-5xl font-bold text-red-600 mb-2">100%</h3><p className="text-gray-600 font-semibold">Discipline</p></div>
            </div>
          </section>
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
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-green-700 mb-3">⭐ Core Values</h3>
            <ul className="text-gray-600 space-y-2 list-disc list-inside">
              <li>Academic Excellence</li>
              <li>Integrity & Discipline</li>
              <li>Inclusivity & Respect</li>
              <li>Community Service</li>
              <li>Faith & Character</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-green-700 mb-3">🤝 Extra-Curricular Activities</h3>
            <ul className="text-gray-600 space-y-2 list-disc list-inside">
              <li>Football & Sports</li>
              <li>Scout Troop</li>
              <li>First Aid Training</li>
              <li>Inter-school competitions and jamborees</li>
            </ul>
          </div>
        </section>
      )}

      {currentPage === "Academics" && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">Academic Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["Mathematics","English","Kiswahili","Physics","Chemistry","Biology","History","Arabic / IRE","Business Studies","Agriculture","Literature"].map((s) => (
              <div key={s} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-3">
                <span className="text-2xl">📚</sp
