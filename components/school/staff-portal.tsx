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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";
import {
  classStudents,
  Lecturer,
  Result,
  FeeRecord,
  getGrade,
} from "@/lib/school-data";
import { cn } from "@/lib/utils";

interface StaffPortalProps {
  lecturer: Lecturer;
  results: Result[];
  fees: Record<string, FeeRecord>;
  onUploadResult: (result: Result) => void;
  onDeleteResult: (student: string, subject: string) => void;
  onUpdateFees: (student: string, total: number, paid: number) => void;
}

export function StaffPortal({
  lecturer,
  results,
  fees,
  onUploadResult,
  onDeleteResult,
  onUpdateFees,
}: StaffPortalProps) {
  const classNames = Object.keys(classStudents);
  const [selectedClass, setSelectedClass] = useState(classNames[0]);
  const [selectedStudent, setSelectedStudent] = useState(classStudents[classNames[0]][0]);
  const [activeTab, setActiveTab] = useState("results");

  // Form states
  const lecturerSubjects = lecturer.subject.split(" / ");
const [newSubject, setNewSubject] = useState(lecturerSubjects[0]);
  const [newMarks, setNewMarks] = useState("");
  const [newGrade, setNewGrade] = useState("");

  const [feeTotal, setFeeTotal] = useState(
    (fees[selectedStudent]?.total || 45000).toString()
  );
  const [feePaid, setFeePaid] = useState(
    (fees[selectedStudent]?.paid || 30000).toString()
  );

  const studentResults = results.filter((r) => r.student === selectedStudent);
  const studentFees = fees[selectedStudent] || { total: 45000, paid: 30000 };

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    const firstStudent = classStudents[className][0];
    setSelectedStudent(firstStudent);
    setFeeTotal((fees[firstStudent]?.total || 45000).toString());
    setFeePaid((fees[firstStudent]?.paid || 30000).toString());
  };

  const handleStudentSelect = (student: string) => {
    setSelectedStudent(student);
    setFeeTotal((fees[student]?.total || 45000).toString());
    setFeePaid((fees[student]?.paid || 30000).toString());
  };

  const handleUploadResult = () => {
    if (!newSubject.trim() || !newMarks.trim()) {
      alert("Enter subject and marks.");
      return;
    }
    const marks = Number(newMarks);
    const grade = newGrade.trim() || getGrade(marks);

    onUploadResult({
      student: selectedStudent,
      className: selectedClass,
      subject: newSubject.trim(),
      marks,
      grade,
    });

    setNewSubject("");
    setNewMarks("");
    setNewGrade("");
  };

  const handleUpdateFees = () => {
    const total = Number(feeTotal);
    const paid = Number(feePaid);

    if (isNaN(total) || isNaN(paid) || total < 0 || paid < 0) {
      alert("Enter valid fee amounts.");
      return;
    }
    if (paid > total) {
      alert("Amount paid cannot exceed total fees.");
      return;
    }

    onUpdateFees(selectedStudent, total, paid);
    alert(`Fees updated for ${selectedStudent}.`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid md:grid-cols-[280px_1fr] gap-4">
        {/* Class List Sidebar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Class Lists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classNames.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {classStudents[selectedClass].map((student) => (
                <button
                  key={student}
                  onClick={() => handleStudentSelect(student)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-md border transition-colors",
                    student === selectedStudent
                      ? "bg-[#e6f1fb] border-[#378add] text-[#0c447c]"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {student}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                 <TabsTrigger value="results">Results</TabsTrigger>
{lecturer.name === "Mr. Osman Halake" && (
  <TabsTrigger value="fees">Fees</TabsTrigger>
)}
                </TabsList>

                <p className="text-sm text-muted-foreground mb-4">
                  Selected: <span className="font-medium text-foreground">{selectedStudent}</span> - {selectedClass}
                </p>

                <TabsContent value="results" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Feed Results</h4>
                    <div className="space-y-2">
                     <select
  value={newSubject}
  onChange={(e) => setNewSubject(e.target.value)}
  className="w-full border rounded-md px-3 py-2 text-sm"
>
  {lecturerSubjects.map((sub) => (
    <option key={sub} value={sub}>{sub}</option>
  ))}
</select>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Marks (0-100)"
                          min={0}
                          max={100}
                          value={newMarks}
                          onChange={(e) => setNewMarks(e.target.value)}
                        />
                        <Input
                          placeholder="Grade (auto or manual)"
                          value={newGrade}
                          onChange={(e) => setNewGrade(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleUploadResult}
                        className="bg-[#1a56a0] hover:bg-[#154a8a]"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Result
                      </Button>
                    </div>
                  </div>

                  {studentResults.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Existing Results</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell>{result.subject}</TableCell>
                              <TableCell>{result.marks}</TableCell>
                              <TableCell className="font-semibold">
                                {result.grade}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    onDeleteResult(selectedStudent, result.subject)
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {studentResults.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No results yet for this student.
                    </p>
                  )}
                </TabsContent>

                {lecturer.name === "Mr. Osman Halake" && (
  <TabsContent value="fees" className="space-y-4">
    <div className="space-y-3">
      <h4 className="font-medium text-sm">Update Fees</h4>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Total Fees (KSh)
          </Label>
          <Input
            type="number"
            value={feeTotal}
            onChange={(e) => setFeeTotal(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Amount Paid (KSh)
          </Label>
          <Input
            type="number"
            value={feePaid}
            onChange={(e) => setFeePaid(e.target.value)}
          />
        </div>
        <div className="p-3 bg-muted rounded-md text-sm">
          Balance:{" "}
          <span className="text-destructive font-medium">
            KSh {(Number(feeTotal) - Number(feePaid)).toLocaleString()}
          </span>
        </div>
        <Button
          onClick={handleUpdateFees}
          className="bg-[#1a56a0] hover:bg-[#154a8a]"
        >
          Update Fees
        </Button>
      </div>
    </div>
  </TabsContent>
)}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
