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

  // Student Login View
  if (view === "student-login") {
    return (
      <main className="min-h-screen bg-background">
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            setView("home");
          }}
          onStudentPortal={() => setView("student-login")}
          onStaffPortal={() => setView("staff-login")}
        />
        <StudentLogin
          onLogin={handleStudentLogin}
          onBack={() => setView("home")}
        />
      </main>
    );
  }

  // Staff Login View
  if (view === "staff-login") {
    return (
      <main className="min-h-screen bg-background">
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            setView("home");
          }}
          onStudentPortal={() => setView("student-login")}
          onStaffPortal={() => setView("staff-login")}
        />
        <StaffLogin
          onLogin={handleStaffLogin}
          onBack={() => setView("home")}
        />
      </main>
    );
  }

  // Home View (default)
  return (
<main className="min-h-screen bg-background">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onStudentPortal={() => setView("student-login")}
        onStaffPortal={() => setView("staff-login")}
      />
      <div className="max-w-4xl mx-auto p-4">
        <div className="space-y-10">

  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <img
      src="/sports.jpg"
      alt="Wamy Isiolo High School"
      className="w-full h-[500px] object-cover"
    />

    <div className="p-8 text-center">
      <h1 className="text-5xl font-bold text-blue-800 mb-4">
        WAMY ISIOLO HIGH SCHOOL
      </h1>

      <p className="text-xl text-gray-700">
        Excellence In Education, Discipline & Leadership
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
      <img
        src="/sports.jpg"
        alt="Sports Team"
        className="w-full h-80 object-cover"
      />

      <div className="p-5">
        <h3 className="text-2xl font-bold">
          Students Sports Team
        </h3>
      </div>
    </div>

    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
      <img
        src="/scouts.jpg"
        alt="Scout Club"
        className="w-full h-80 object-cover"
      />

      <div className="p-5">
        <h3 className="text-2xl font-bold">
          Scout Club Members
        </h3>
      </div>
    </div>

    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
      <img
        src="/firstaid.jpg"
        alt="First Aid"
        className="w-full h-80 object-cover"
      />

      <div className="p-5">
        <h3 className="text-2xl font-bold">
          First Aid & Certificate Award
        </h3>
      </div>
    </div>

    <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
      <img
        src="/outdoor.jpg"
        alt="Outdoor Activity"
        className="w-full h-80 object-cover"
      />

      <div className="p-5">
        <h3 className="text-2xl font-bold">
          Educational Outdoor Activity
        </h3>
      </div>
    </div>

  
      </div>
</main>
  );
}
