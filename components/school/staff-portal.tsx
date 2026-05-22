"use client";
import { supabase } from "@/lib/supabase";
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
import { Trash2, Plus, Trophy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  classStudents,
  Lecturer,
  Result,
  FeeRecord,
  getGrade,
  getGrade10Grade,
  termOptions,
} from "@/lib/school-data";

interface StaffPortalProps {
  lecturer: Lecturer;
  results: Result[];
  fees: Record<string, FeeRecord>;
  onUploadResult: (result: Result) => void;
  onDeleteResult: (student: string, subject: string, term: string) => void;
  onUpdateFees: (student: string, total: number, paid: number) => void;
  materials: any[];
  onPostMaterial: (material: any) => void;
  onDeleteMaterial: (id: string) => void;
  timetables: any[];
  onUploadTimetable: (timetable: any) => void;
  onDeleteTimetable: (id: string) => void;
}

export function StaffPortal({
  lecturer,
  results,
  fees,
  onUploadResult,
  onDeleteResult,
  onUpdateFees,
  materials,
  onPostMaterial,
  onDeleteMaterial,
  timetables,
  onUploadTimetable,
  onDeleteTimetable,
}: StaffPortalProps) {
  const classNames = Object.keys(classStudents);
  const [selectedClass, setSelectedClass] = useState(classNames[0]);
  const [selectedStudent, setSelectedStudent] = useState(classStudents[classNames[0]][0]);
  const [activeTab, setActiveTab] = useState("results");

  const lecturerSubjects = lecturer.subject.split(" / ");
  const [newSubject, setNewSubject] = useState(lecturerSubjects[0]);
  const [newMarks, setNewMarks] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newTerm, setNewTerm] = useState("Term 1, 2026");

  const [meritClass, setMeritClass] = useState(classNames[0]);
  const [meritTerm, setMeritTerm] = useState("Term 1, 2026");

  const [matTitle, setMatTitle] = useState("");
  const [matDesc, setMatDesc] = useState("");
  const [matClass, setMatClass] = useState(classNames[0]);
  const [matSubject, setMatSubject] = useState(lecturerSubjects[0]);
  const [matContent, setMatContent] = useState("");
  const [matFile, setMatFile] = useState<File | null>(null);
  const [matUploading, setMatUploading] = useState(false);
  const [ttType, setTtType] = useState("teaching");
  const [ttTitle, setTtTitle] = useState("");
  const [ttTerm, setTtTerm] = useState("Term 1, 2026");
  const [ttFile, setTtFile] = useState<File | null>(null);
  const [ttUploading, setTtUploading] = useState(false);

  const [feeTotal, setFeeTotal] = useState(
    (fees[selectedStudent]?.total || 45000).toString()
  );
  const [feePaid, setFeePaid] = useState(
    (fees[selectedStudent]?.paid || 30000).toString()
  );

  const studentResults = results.filter((r) => r.student === selectedStudent);

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
    const grade = newGrade.trim() || (selectedClass === 'Grade 10' ? getGrade10Grade(marks) : getGrade(marks));
    onUploadResult({
      student: selectedStudent,
      className: selectedClass,
      subject: newSubject.trim(),
      marks,
      grade,
      term: newTerm,
    });
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

  const handlePostMaterial = async () => {
    if (!matTitle.trim()) { alert("Enter a title."); return; }
    setMatUploading(true);

    let file_url = "";
    let file_name = "";

    if (matFile) {
      const filePath = `${Date.now()}_${matFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("materials")
        .upload(filePath, matFile);
      if (uploadError) {
        alert("File upload failed.");
        setMatUploading(false);
        return;
      }
      const { data } = supabase.storage.from("materials").getPublicUrl(filePath);
      file_url = data.publicUrl;
      file_name = matFile.name;
    }

    onPostMaterial({
      title: matTitle,
      description: matDesc,
      subject: matSubject,
      class_name: matClass,
      teacher_name: lecturer.name,
      type: matFile ? "file" : "text",
      content: matContent,
      file_url,
      file_name,
    });

    setMatTitle("");
    setMatDesc("");
    setMatContent("");
    setMatFile(null);
    setMatUploading(false);
  };

  const handleUploadTimetable = async () => {
    if (!ttFile || !ttTitle.trim()) { alert("Enter title and select a file."); return; }
    setTtUploading(true);
    const filePath = `${Date.now()}_${ttFile.name}`;
    const { error: uploadError } = await supabase.storage.from("timetables").upload(filePath, ttFile);
    if (uploadError) { alert("Upload failed."); setTtUploading(false); return; }
    const { data } = supabase.storage.from("timetables").getPublicUrl(filePath);
    onUploadTimetable({
      type: ttType,
      title: ttTitle,
      term: ttTerm,
      file_url: data.publicUrl,
      file_name: ttFile.name,
    });
    setTtTitle("");
    setTtFile(null);
    setTtUploading(false);
  };

  const getMeritList = () => {
    const students = classStudents[meritClass];
    return students
      .map((student) => {
        const studentTermResults = results.filter(
          (r) => r.student === student && r.term === meritTerm
        );
        const totalMarks = studentTermResults.reduce((sum, r) => sum + r.marks, 0);
        const subjects = studentTermResults.length;
        const average = subjects > 0
          ? Math.round((totalMarks / subjects) * 10) / 10
          : 0;
        const overallGrade = subjects > 0 ? (meritClass === 'Grade 10' ? getGrade10Grade(average) : getGrade(average)) : "-";
        return { student, totalMarks, subjects, average, overallGrade };
      })
      .filter((s) => s.subjects > 0)
      .sort((a, b) => b.totalMarks - a.totalMarks);
  };

  const meritList = getMeritList();

  const resultsByTerm = studentResults.reduce((acc, r) => {
    const t = r.term || "Unknown Term";
    if (!acc[t]) acc[t] = [];
    acc[t].push(r);
    return acc;
  }, {} as Record<string, Result[]>);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid md:grid-cols-[280px_1fr] gap-4">
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

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="merit">
                    <Trophy className="h-4 w-4 mr-1" />
                    Merit List
                  </TabsTrigger>
                  <TabsTrigger value="materials">📚 Materials</TabsTrigger>
                  <TabsTrigger value="timetables">📅 Timetables</TabsTrigger>
                  {lecturer.name === "Mr. Osman Halake" && (
                    <TabsTrigger value="fees">Fees</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="results" className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Selected: <span className="font-medium text-foreground">{selectedStudent}</span> - {selectedClass}
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Feed Results</h4>
                    <div className="space-y-2">
                      <select
                        value={newTerm}
                        onChange={(e) => setNewTerm(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      >
                        {termOptions.map((term) => (
                          <option key={term} value={term}>{term}</option>
                        ))}
                      </select>
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
                      <Button onClick={handleUploadResult} className="bg-[#1a56a0] hover:bg-[#154a8a]">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Result
                      </Button>
                    </div>
                  </div>

                  {studentResults.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">Existing Results</h4>
                      {Object.entries(resultsByTerm).map(([term, termResults]) => (
                        <div key={term}>
                          <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">{term}</p>
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
                              {termResults.map((result, index) => (
                                <TableRow key={index}>
                                  <TableCell>{result.subject}</TableCell>
                                  <TableCell>{result.marks}</TableCell>
                                  <TableCell className="font-semibold">{result.grade}</TableCell>
                                  <TableCell>
                                    {lecturerSubjects.includes(result.subject) && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDeleteResult(selectedStudent, result.subject, result.term)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No results yet for this student.</p>
                  )}
                </TabsContent>

                <TabsContent value="merit" className="space-y-4">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Class Merit List
                  </h4>
                  <div className="flex gap-2">
                    <select
                      value={meritClass}
                      onChange={(e) => setMeritClass(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm flex-1"
                    >
                      {classNames.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                    <select
                      value={meritTerm}
                      onChange={(e) => setMeritTerm(e.target.value)}
                      className="border rounded-md px-3 py-2 text-sm flex-1"
                    >
                      {termOptions.map((term) => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>

                  {meritList.length > 0 ? (() => {
                    const classTermResults = results.filter(
                      (r) => r.className === meritClass && r.term === meritTerm
                    );
                    const subjects = [...new Set(classTermResults.map((r) => r.subject))].sort();
                    const subjectMeans = subjects.map((subject) => {
                      const subjectResults = classTermResults.filter((r) => r.subject === subject);
                      const mean = subjectResults.length > 0
                        ? Math.round((subjectResults.reduce((sum, r) => sum + r.marks, 0) / subjectResults.length) * 10) / 10
                        : 0;
                      return { subject, mean, grade: meritClass === 'Grade 10' ? getGrade10Grade(mean) : getGrade(mean) };
                    });
                    const classOverallMean = meritList.length > 0
                      ? Math.round((meritList.reduce((sum, s) => sum + s.average, 0) / meritList.length) * 10) / 10
                      : 0;

                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-3 py-2 text-left font-semibold whitespace-nowrap">Student</th>
                              {subjects.map((s) => (
                                <th key={s} className="border border-gray-200 px-3 py-2 text-center font-semibold whitespace-nowrap">{s}</th>
                              ))}
                              <th className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50">Total</th>
                              <th className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50">Mean</th>
                              <th className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {meritList.map((entry, index) => (
                              <tr key={entry.student} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="border border-gray-200 px-3 py-2 font-medium whitespace-nowrap">
                                  {index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : `${index + 1}. `}
                                  {entry.student}
                                </td>
                                {subjects.map((subject) => {
                                  const r = classTermResults.find(
                                    (r) => r.student === entry.student && r.subject === subject
                                  );
                                  return (
                                    <td key={subject} className="border border-gray-200 px-3 py-2 text-center">
                                      {r ? (
                                        <span>
                                          {r.marks}<br />
                                          <span className="text-xs text-muted-foreground">
                                            {meritClass === 'Grade 10' ? getGrade10Grade(r.marks) : getGrade(r.marks)}
                                          </span>
                                        </span>
                                      ) : (
                                        <span className="text-gray-300">—</span>
                                      )}
                                    </td>
                                  );
                                })}
                                <td className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50">{entry.totalMarks}</td>
                                <td className="border border-gray-200 px-3 py-2 text-center bg-blue-50">{entry.average}</td>
                                <td className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50">{entry.overallGrade}</td>
                              </tr>
                            ))}
                            <tr className="bg-yellow-50 font-semibold">
                              <td className="border border-gray-200 px-3 py-2">Subject Mean</td>
                              {subjectMeans.map(({ subject, mean, grade }) => (
                                <td key={subject} className="border border-gray-200 px-3 py-2 text-center">
                                  {mean}<br />
                                  <span className="text-xs">{grade}</span>
                                </td>
                              ))}
                              <td className="border border-gray-200 px-3 py-2 text-center bg-yellow-100">—</td>
                              <td className="border border-gray-200 px-3 py-2 text-center bg-yellow-100">{classOverallMean}</td>
                              <td className="border border-gray-200 px-3 py-2 text-center font-semibold bg-yellow-100">{meritClass === 'Grade 10' ? getGrade10Grade(classOverallMean) : getGrade(classOverallMean)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })() : (
                    <p className="text-sm text-muted-foreground">No results found for {meritClass} — {meritTerm}.</p>
                  )}
                </TabsContent>

                <TabsContent value="materials" className="space-y-4">
                  <h4 className="font-medium text-sm">Post New Material</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <select value={matClass} onChange={(e) => setMatClass(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
                        {classNames.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                        <option value="All Classes">All Classes</option>
                      </select>
                      <select value={matSubject} onChange={(e) => setMatSubject(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
                        {lecturerSubjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                      </select>
                    </div>
                    <Input
                      placeholder="Title (e.g. Assignment 1 — Algebra)"
                      value={matTitle}
                      onChange={(e) => setMatTitle(e.target.value)}
                    />
                    <textarea
                      placeholder="Type notes, instructions or revision questions here... (optional if uploading a file)"
                      value={matContent}
                      onChange={(e) => setMatContent(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm min-h-[100px]"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Upload PDF or file (optional)</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                        onChange={(e) => setMatFile(e.target.files?.[0] || null)}
                        className="text-sm"
                      />
                      {matFile && <p className="text-xs text-green-600 mt-1">Selected: {matFile.name}</p>}
                    </div>
                    <Input
                      placeholder="Description (optional)"
                      value={matDesc}
                      onChange={(e) => setMatDesc(e.target.value)}
                    />
                    <Button onClick={handlePostMaterial} disabled={matUploading} className="bg-[#1a56a0] hover:bg-[#154a8a]">
                      <Plus className="h-4 w-4 mr-2" />
                      {matUploading ? "Posting..." : "Post Material"}
                    </Button>
                  </div>

                  <h4 className="font-medium text-sm mt-4">Posted Materials</h4>
                  {materials.filter((m) => m.teacher_name === lecturer.name).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No materials posted yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {materials.filter((m) => m.teacher_name === lecturer.name).map((m) => (
                        <div key={m.id} className="border rounded-md p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{m.title}</p>
                            <Button variant="outline" size="sm" onClick={() => onDeleteMaterial(m.id)} className="text-destructive border-destructive hover:bg-destructive/10">Delete</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">{m.subject} · {m.class_name} · {new Date(m.created_at).toLocaleDateString()}</p>
                          {m.content && <p className="text-sm text-muted-foreground line-clamp-2">{m.content}</p>}
                          {m.file_url && (
                            <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">
                              📎 {m.file_name}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="timetables" className="space-y-4">
                  {lecturer.name === "Mr. Osman Halake" && (
                    <div className="space-y-3 border rounded-md p-3">
                      <h4 className="font-medium text-sm">Upload Timetable</h4>
                      <select value={ttType} onChange={(e) => setTtType(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="teaching">Teaching Timetable</option>
                        <option value="exam">Exam Timetable</option>
                      </select>
                      <select value={ttTerm} onChange={(e) => setTtTerm(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
                        {termOptions.map((term) => <option key={term} value={term}>{term}</option>)}
                      </select>
                      <Input placeholder="Title (e.g. Form 4 Teaching Timetable)" value={ttTitle} onChange={(e) => setTtTitle(e.target.value)} />
                      <input type="file" accept=".pdf,.jpg,.png,.doc,.docx" onChange={(e) => setTtFile(e.target.files?.[0] || null)} className="text-sm" />
                      {ttFile && <p className="text-xs text-green-600">Selected: {ttFile.name}</p>}
                      <Button onClick={handleUploadTimetable} disabled={ttUploading} className="bg-[#1a56a0] hover:bg-[#154a8a]">
                        {ttUploading ? "Uploading..." : "Upload Timetable"}
                      </Button>
                    </div>
                  )}

                  <h4 className="font-medium text-sm">Teaching Timetables</h4>
                  {timetables.filter((t) => t.type === "teaching").length === 0 ? (
                    <p className="text-sm text-muted-foreground">No teaching timetables uploaded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {timetables.filter((t) => t.type === "teaching").map((t) => (
                        <div key={t.id} className="border rounded-md p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{t.title}</p>
                            <p className="text-xs text-muted-foreground">{t.term} · {new Date(t.created_at).toLocaleDateString()}</p>
                            <a href={t.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">📎 {t.file_name}</a>
                          </div>
                          {lecturer.name === "Mr. Osman Halake" && (
                            <Button variant="outline" size="sm" onClick={() => onDeleteTimetable(t.id)} className="text-destructive border-destructive">Delete</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <h4 className="font-medium text-sm mt-2">Exam Timetables</h4>
                  {timetables.filter((t) => t.type === "exam").length === 0 ? (
                    <p className="text-sm text-muted-foreground">No exam timetables uploaded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {timetables.filter((t) => t.type === "exam").map((t) => (
                        <div key={t.id} className="border rounded-md p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{t.title}</p>
                            <p className="text-xs text-muted-foreground">{t.term} · {new Date(t.created_at).toLocaleDateString()}</p>
                            <a href={t.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">📎 {t.file_name}</a>
                          </div>
                          {lecturer.name === "Mr. Osman Halake" && (
                            <Button variant="outline" size="sm" onClick={() => onDeleteTimetable(t.id)} className="text-destructive border-destructive">Delete</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {lecturer.name === "Mr. Osman Halake" && (
                  <TabsContent value="fees" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Update Fees</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Total Fees (KSh)</Label>
                          <Input type="number" value={feeTotal} onChange={(e) => setFeeTotal(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Amount Paid (KSh)</Label>
                          <Input type="number" value={feePaid} onChange={(e) => setFeePaid(e.target.value)} />
                        </div>
                        <div className="p-3 bg-muted rounded-md text-sm">
                          Balance:{" "}
                          <span className="text-destructive font-medium">
                            KSh {(Number(feeTotal) - Number(feePaid)).toLocaleString()}
                          </span>
                        </div>
                        <Button onClick={handleUpdateFees} className="bg-[#1a56a0] hover:bg-[#154a8a]">
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
