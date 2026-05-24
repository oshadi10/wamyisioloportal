"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { studentAccounts, lecturers, Lecturer } from "@/lib/school-data";

interface StudentLoginProps {
  onLogin: (studentName: string) => void;
  onBack: () => void;
}

export function StudentLogin({ onLogin, onBack }: StudentLoginProps) {
  const [typedName, setTypedName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    if (!typedName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    // Standardize input formatting to safely scan the data object keys
    const inputName = typedName.trim().toLowerCase();

    // Look for an account match in your school data
    const matchedStudentName = Object.keys(studentAccounts).find(
      (name) => name.toLowerCase() === inputName
    );

    if (matchedStudentName) {
      // Validate the found user matching password identifier
      if (studentAccounts[matchedStudentName] === password.trim()) {
        onLogin(matchedStudentName);
      } else {
        setError("Invalid credentials. Your password is your admission number.");
      }
    } else {
      setError("Student record not found. Please double-check the spelling of your full name.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Student Portal Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* SAFE TEXT INPUT METHOD (NO DROPDOWN LIST) */}
          <div className="space-y-2">
            <Label htmlFor="student-name">Full Name</Label>
            <Input
              id="student-name"
              type="text"
              placeholder="Enter your full name"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="text-slate-950"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-password">Password</Label>
            <Input
              id="student-password"
              type="password"
              placeholder="Enter your admission number"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="text-slate-950"
            />
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleLogin} className="flex-1 bg-[#1a56a0] hover:bg-[#154a8a]">
              Login
            </Button>
            <Button variant="outline" onClick={onBack} className="flex-1 text-slate-800">
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StaffLoginProps {
  onLogin: (lecturer: Lecturer) => void;
  onBack: () => void;
}

export function StaffLogin({ onLogin, onBack }: StaffLoginProps) {
  const [typedEmail, setTypedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    if (!typedEmail.trim()) {
      setError("Please enter your email address");
      return;
    }

    const lecturer = lecturers.find(
      (l) => l.email.toLowerCase() === typedEmail.trim().toLowerCase() && l.password === password
    );

    if (lecturer) {
      onLogin(lecturer);
    } else {
      setError("Invalid login details");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Staff Portal Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* SECURED STAFF USERNAME/EMAIL ELEMENT TEXT BOX */}
          <div className="space-y-2">
            <Label htmlFor="staff-email">Email Address</Label>
            <Input
              id="staff-email"
              type="email"
              placeholder="Enter your registered staff email"
              value={typedEmail}
              onChange={(e) => setTypedEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="text-slate-950"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff-password">Password</Label>
            <Input
              id="staff-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="text-slate-950"
            />
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleLogin} className="flex-1 bg-[#146f3a] hover:bg-[#0f5a2e]">
              Login
            </Button>
            <Button variant="outline" onClick={onBack} className="flex-1 text-slate-800">
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
