"use client";

import { useState } from "react";
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
  initialResults,
  studentAccounts,
  getStudentClass,
} from "@/lib/school-data";

type ViewType = "home" | "student-login" | "staff-login" | "student-portal" | "staff-portal";

export default function SchoolPortal() {
  const [view, setView] = useState<ViewType>("home");
  const [currentPage, setCurrentPage] = useState("Home");
  const [loggedInStudent, setLoggedInStudent] = useState<string | null>(null);
  const [loggedInLecturer, setLoggedInLecturer] = useState<Lecturer | null>(null);
  const [results, setResults] = useState<Result[]>(initialResults);
  const [fees, setFees] = useState<Record<string, FeeRecord>>(initializeFees);

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

  const handleUploadResult = (result: Result) => {
    setResults((prev) => {
      // Remove existing result for same student+subject
      const filtered = prev.filter(
        (r) => !(r.student === result.student && r.subject === result.subject)
      );
      return [...filtered, result];
    });
  };

  const handleDeleteResult = (student: string, subject: string) => {
    setResults((prev) =>
      prev.filter((r) => !(r.student === student && r.subject === subject))
    );
  };

  const handleUpdateFees = (student: string, total: number, paid: number) => {
    setFees((prev) => ({
      ...prev,
      [student]: { total, paid },
    }));
  };

  // Student Portal View
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

  // Staff Portal View
  if (view === "staff-portal" && loggedInLecturer) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onStudentPortal={() => setView("student-login")}
          onStaffPortal={() => setView("staff-login")}
        />

        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-r from-blue-950 via-green-900 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h1 className="text-5xl font-bold mb-6">
              WAMY Isiolo High School
            </h1>

            <p className="text-xl max-w-3xl mx-auto mb-8 text-gray-200">
              Excellence Through Education, Discipline & Leadership.
              Nurturing future leaders through quality education,
              Islamic values and holistic development.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-4">
              <button
                onClick={() => setView("student-login")}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold shadow-lg"
              >
                Student Portal
              </button>

              <button
                onClick={() => setView("staff-login")}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold shadow-lg"
              >
                Staff Portal
              </button>
            </div>
          </div>
        </section>

        {/* WELCOME */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">
              Welcome to WAMY Isiolo High School
            </h2>

            <p className="text-gray-700 text-lg leading-8 max-w-4xl mx-auto">
              WAMY Isiolo High School is dedicated to academic excellence,
              discipline, innovation and character building. We provide
              quality education in a supportive Islamic environment that
              empowers students to succeed academically and morally.
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-5xl font-bold text-blue-700 mb-2">69+</h3>
              <p className="text-gray-600 font-semibold">Students</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-5xl font-bold text-green-700 mb-2">8</h3>
              <p className="text-gray-600 font-semibold">Staff Members</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-5xl font-bold text-yellow-600 mb-2">3</h3>
              <p className="text-gray-600 font-semibold">Classes</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-5xl font-bold text-red-600 mb-2">100%</h3>
              <p className="text-gray-600 font-semibold">Discipline</p>
            </div>

          </div>
        </section>

        {/* SCHOOL LIFE */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">
            School Life & Activities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/sports.jpg"
                alt="Sports"
                className="w-full h-72 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Sports & Teamwork</h3>
                <p className="text-gray-600">
                  Building discipline, teamwork and leadership through sports.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
              <img
                src="/scouts.jpg"
                alt="Scouts"
                className="w-full h-72 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">Scouts Movement</h3>
                <p className="text-gray-600">
                  Training responsible students with leadership skills and character.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* PRINCIPAL MESSAGE */}
        <section className="bg-blue-950 text-white py-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">
              Message from the Principal
            </h2>

            <p className="text-xl leading-9 text-gray-200">
              “At WAMY Isiolo High School, we believe in nurturing students
              academically, morally and spiritually. Our mission is to produce
              disciplined future leaders prepared for success in this world and
              the hereafter.”
            </p>

            <div className="mt-8 text-yellow-400 font-bold text-xl">
              — Principal Osman Halake
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black text-gray-300 py-10">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              WAMY Isiolo High School
            </h3>

            <p>Email: info@wamyisiolo.sc.ke</p>
            <p>Isiolo, Kenya</p>

            <div className="mt-6 text-sm text-gray-500">
              © 2026 WAMY Isiolo High School. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    );
  }
