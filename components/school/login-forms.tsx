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

    // Clean up outer spaces but keep the exact letters, titles, and dots intact
    const inputName = typedName.trim().toLowerCase();

    // Strict direct match checking against the exact database strings
    const lecturer = lecturers.find(
      (l) => l.name.toLowerCase().trim() === inputName && l.password === password.trim()
    );

    if (lecturer) {
      onLogin(lecturer);
    } else {
      setError("Invalid login details. Please ensure you include your title (e.g., 'Mr. Osman Halake') and check your password.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Staff Portal Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="staff-name">Full Name</Label>
            <Input
              id="staff-name"
              type="text"
              placeholder="Include your title (e.g. Mr. Osman Halake)"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
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
