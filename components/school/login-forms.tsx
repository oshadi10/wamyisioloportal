"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { studentAccounts, lecturers, Lecturer } from "@/lib/school-data";

interface StudentLoginProps {
  onLogin: (studentName: string) => void;
  onBack: () => void;
}

export function StudentLogin({ onLogin, onBack }: StudentLoginProps) {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!selectedStudent) {
      setError("Please select a student");
      return;
    }
    if (studentAccounts[selectedStudent] === password) {
      onLogin(selectedStudent);
    } else {
      setError("Invalid login details. Password is your admission number.");
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
            <Label htmlFor="student-select">Select Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger id="student-select">
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {Object.keys(studentAccounts).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleLogin} className="flex-1 bg-[#1a56a0] hover:bg-[#154a8a]">
              Login
            </Button>
            <Button variant="outline" onClick={onBack} className="flex-1">
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
  const [selectedEmail, setSelectedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!selectedEmail) {
      setError("Please select a lecturer");
      return;
    }
    const lecturer = lecturers.find(
      (l) => l.email === selectedEmail && l.password === password
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
          <div className="space-y-2">
            <Label htmlFor="staff-select">Select Lecturer</Label>
            <Select value={selectedEmail} onValueChange={setSelectedEmail}>
              <SelectTrigger id="staff-select">
                <SelectValue placeholder="Select Lecturer" />
              </SelectTrigger>
              <SelectContent>
                {lecturers.map((lecturer) => (
                  <SelectItem key={lecturer.email} value={lecturer.email}>
                    {lecturer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleLogin} className="flex-1 bg-[#146f3a] hover:bg-[#0f5a2e]">
              Login
            </Button>
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
