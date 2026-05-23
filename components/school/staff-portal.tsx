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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Trophy, Calendar, FileText } from "lucide-react";
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
  onUploadTermDate: (termRow: any) => void;
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
  onUploadTermDate,
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

  const [evtType, setEvtType] = useState("announcement");
  const [evtTitle, setEvtTitle] = useState("");
  const [evtDesc, setEvtDesc] = useState("");
  const [evtDate, setEvtDate] = useState("");

  const [newOpeningDate, setNewOpeningDate] = useState("");
  const [newIddBreak, setNewIddBreak] = useState("");
  const [newMidExam, setNewMidExam] = useState("");
  const [newMidBreak, setNewMidBreak] = useState("");
  const [newEndExam, setNewEndExam] = useState("");
  const [newClosingDate, setNewClosingDate] = useState("");

  const [feeTotal, setFeeTotal] = useState(
    (fees[selectedStudent]?.total || 45000).toString()
  );
  const [feePaid, setFeePaid] = useState(
    (fees[selectedStudent]?.paid || 30000).toString()
  );

  const [students, setStudents] = useState<any[]>([]);
const [stdName, setStdName] = useState("");
const [stdClass, setStdClass] = useState(classNames[0]);
const [stdAdmNo, setStdAdmNo] = useState("");
const [stdParent, setStdParent] = useState("");
const [stdRegistering, setStdRegistering] = useState(false);
const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
const [docType, setDocType] = useState("Birth Certificate");
const [docFile, setDocFile] = useState<File | null>(null);
const [docUploading, setDocUploading] = useState(false);
const [studentDocs, setStudentDocs] = useState<any[]>([]);

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

  const handlePostEvent = async () => {
    if (!evtTitle.trim()) { alert("Enter a title."); return; }
    const { error } = await supabase.from("events").insert({
      type: evtType,
      title: evtTitle,
      description: evtDesc,
      date: evtDate,
    });
    if (error) { alert("Failed to post."); return; }
    setEvtTitle("");
    setEvtDesc("");
    setEvtDate("");
    alert("Posted successfully!");
  };

  const handleDeleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
  };
  const fetchStudents = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error(error); return; }
  setStudents(data || []);
};

const fetchStudentDocs = async (studentId: string) => {
  const { data, error } = await supabase
    .from("student_documents")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  if (error) { console.error(error); return; }
  setStudentDocs(data || []);
};

const handleRegisterStudent = async () => {
  if (!stdName.trim() || !stdAdmNo.trim()) {
    alert("Enter student name and admission number.");
    return;
  }
  setStdRegistering(true);
  const { error } = await supabase.from("students").insert({
    name: stdName,
    class_name: stdClass,
    admission_no: stdAdmNo,
    parent_contact: stdParent,
  });
  if (error) { alert("Failed to register student."); setStdRegistering(false); return; }
  alert(`${stdName} registered successfully!`);
  setStdName("");
  setStdAdmNo("");
  setStdParent("");
  setStdRegistering(false);
  fetchStudents();
};

const handleDeleteStudent = async (id: string) => {
  if (!confirm("Delete this student and all their documents?")) return;
  await supabase.from("students").delete().eq("id", id);
  fetchStudents();
  setSelectedStudentId(null);
  setStudentDocs([]);
};

const handleUploadDoc = async () => {
  if (!selectedStudentId) { alert("Select a student first."); return; }
  if (!docFile) { alert("Select a file to upload."); return; }
  setDocUploading(true);
  const filePath = `${selectedStudentId}/${Date.now()}_${docFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("student-documents")
    .upload(filePath, docFile);
  if (uploadError) { alert("Upload failed."); setDocUploading(false); return; }
  const { data } = supabase.storage.from("student-documents").getPublicUrl(filePath);
  const { error: insertError } = await supabase.from("student_documents").insert({
    student_id: selectedStudentId,
    document_name: docType,
    document_type: docType,
    file_url: data.publicUrl,
    file_name: docFile.name,
  });
  if (insertError) { alert("Failed to save document."); setDocUploading(false); return; }
  alert("Document uploaded!");
  setDocFile(null);
  setDocUploading(false);
  fetchStudentDocs(selectedStudentId);
};

const handleDeleteDoc = async (id: string) => {
  await supabase.from("student_documents").delete().eq("id", id);
  if (selectedStudentId) fetchStudentDocs(selectedStudentId);
};

  const handlePostMaterial = async () => {
    if (!matTitle.trim()) { alert("Enter a title."); return; }
    setMatUploading(true);
    let file_url = "";
    let file_name = "";
    if (matFile) {
      const filePath = `${Date.now()}_${matFile.name}`;
      const { error: uploadError } = await supabase.storage.from("materials").upload(filePath, matFile);
      if (uploadError) { alert("File upload failed."); setMatUploading(false); return; }
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
    setMatTitle(""); setMatDesc(""); setMatContent(""); setMatFile(null); setMatUploading(false);
  };

  const handleUploadTimetable = async () => {
    if (!ttFile || !ttTitle.trim()) { alert("Enter title and select a file."); return; }
    setTtUploading(true);
    const filePath = `${Date.now()}_${ttFile.name}`;
    const { error: uploadError } = await supabase.storage.from("timetables").upload(filePath, ttFile);
    if (uploadError) { alert("Upload failed."); setTtUploading(false); return; }
    const { data } = supabase.storage.from("timetables").getPublicUrl(filePath);
    onUploadTimetable({ type: ttType, title: ttTitle, term: ttTerm, file_url: data.publicUrl, file_name: ttFile.name });
    setTtTitle(""); setTtFile(null); setTtUploading(false);
  };

  const handleAddTermRow = async () => {
    if (!newOpeningDate.trim() || !newClosingDate.trim()) {
      alert("Please fill out at least Opening and Closing dates.");
      return;
    }
    const termData: any = {
      term: "Term 2, 2026",
      opening_date: newOpeningDate,
      idd_date: newIddBreak || "—",
      midterm_exam: newMidExam || "—",
      mid_term: newMidBreak || "—",
      end_term_exam: newEndExam || "—",
      closing_date: newClosingDate,
      status: "Current Term",
    };
    try {
      const { error: deleteError } = await supabase.from("term_dates").delete().neq("term", "xyz_placeholder_safety");
      if (deleteError) { console.error(deleteError); alert("Failed to clear old dates."); return; }
      const { error: insertError } = await supabase.from("term_dates").insert(termData);
      if (insertError) { console.error(insertError); alert("Failed to save term dates."); return; }
      alert("Homepage calendar successfully updated!");
      setNewOpeningDate(""); setNewIddBreak(""); setNewMidExam(""); setNewMidBreak(""); setNewEndExam(""); setNewClosingDate("");
      onUploadTermDate(termData);
    } catch (e) {
      console.error(e);
      alert("Something went wrong.");
    }
  };

  const getMeritList = () => {
    const students = classStudents[meritClass];
    return students.map((student) => {
      const studentTermResults = results.filter((r) => r.student === student && r.term === meritTerm);
      const totalMarks = studentTermResults.reduce((sum, r) => sum + r.marks, 0);
      const subjects = studentTermResults.length;
      const average = subjects > 0 ? Math.round((totalMarks / subjects) * 10) / 10 : 0;
      const overallGrade = subjects > 0 ? (meritClass === 'Grade 10' ? getGrade10Grade(average) : getGrade(average)) : "-";
      return { student, totalMarks, subjects, average, overallGrade };
    }).filter((s) => s.subjects > 0).sort((a, b) => b.totalMarks - a.totalMarks);
  };

  const meritList = getMeritList();

  const resultsByTerm = studentResults.reduce((acc, r) => {
    const t = r.term || "Unknown Term";
    if (!acc[t]) acc[t] = [];
    acc[t].push(r);
    return acc;
  }, {} as Record<string, Result[]>);

  const isImageFile = (fileName: string) => {
    if (!fileName) return false;
    const n = fileName.toLowerCase();
    return n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".webp");
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid md:grid-cols-[280px_1fr] gap-4">

        {/* Sidebar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Class Lists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {classNames.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {classStudents[selectedClass].map((student) => (
                <button key={student} onClick={() => handleStudentSelect(student)}
                  className={cn("w-full text-left px-3 py-2 text-sm rounded-md border transition-colors",
                    student === selectedStudent ? "bg-[#e6f1fb] border-[#378add] text-[#0c447c]" : "border-border hover:bg-muted")}>
                  {student}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 flex-wrap">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="merit"><Trophy className="h-4 w-4 mr-1" />Merit List</TabsTrigger>
                  <TabsTrigger value="materials">📚 Materials</TabsTrigger>
                  <TabsTrigger value="timetables">📅 Timetables</TabsTrigger>
                 {lecturer.name === "Mr. Osman Halake" && (
  <TabsTrigger value="fees">Fees</TabsTrigger>
)}
{lecturer.name === "Mr. Osman Halake" && (
  <TabsTrigger value="events">📣 Events</TabsTrigger>
)}
{lecturer.name === "Mr. Osman Halake" && (
  <TabsTrigger value="students">🎓 Students</TabsTrigger>
)}
                </TabsList>

                {/* RESULTS TAB */}
                <TabsContent value="results" className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Selected: <span className="font-medium text-foreground">{selectedStudent}</span> - {selectedClass}
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Feed Results</h4>
                    <div className="space-y-2">
                      <select value={newTerm} onChange={(e) => setNewTerm(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                        {termOptions.map((term) => <option key={term} value={term}>{term}</option>)}
                      </select>
                      <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                        {lecturerSubjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                      </select>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Marks (0-100)" min={0} max={100} value={newMarks} onChange={(e) => setNewMarks(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                        <input placeholder="Grade (auto or manual)" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      </div>
                      <Button onClick={handleUploadResult} className="bg-[#1a56a0] hover:bg-[#154a8a]">
                        <Plus className="h-4 w-4 mr-2" />Upload Result
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
                                      <Button variant="outline" size="sm" onClick={() => onDeleteResult(selectedStudent, result.subject, result.term)}>
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
                  {lecturer.name === "Mr. Osman Halake" && (<TabsContent value="students" className="space-y-6">

  {/* REGISTER NEW STUDENT */}
  <div className="border rounded-md p-4 bg-muted/30 space-y-3">
    <h4 className="font-semibold text-sm text-blue-900">🎓 Register New Student</h4>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="text-xs font-semibold">Full Name</Label>
        <input placeholder="e.g. Amina Hassan" value={stdName} onChange={(e) => setStdName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div>
        <Label className="text-xs font-semibold">Admission No</Label>
        <input placeholder="e.g. 433" value={stdAdmNo} onChange={(e) => setStdAdmNo(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="text-xs font-semibold">Class</Label>
        <select value={stdClass} onChange={(e) => setStdClass(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white h-10">
          {classNames.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <Label className="text-xs font-semibold">Parent Contact</Label>
        <input placeholder="e.g. 0712345678" value={stdParent} onChange={(e) => setStdParent(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
    </div>
    <Button onClick={handleRegisterStudent} disabled={stdRegistering} className="bg-blue-700 hover:bg-blue-800 text-white w-full">
      <Plus className="h-4 w-4 mr-2" />{stdRegistering ? "Registering..." : "Register Student"}
    </Button>
  </div>

  {/* STUDENT LIST */}
  <div className="space-y-3">
    <h4 className="font-semibold text-sm text-slate-800 border-b pb-1">Registered Students</h4>
    <Button onClick={fetchStudents} variant="outline" className="text-xs">🔄 Refresh List</Button>
    {students.length === 0 ? (
      <p className="text-sm text-muted-foreground italic">No students registered yet. Click Refresh.</p>
    ) : (
      <div className="space-y-3">
        {students.map((s) => (
          <div key={s.id} className={`border rounded-lg p-4 bg-white shadow-sm space-y-3 cursor-pointer transition-colors ${selectedStudentId === s.id ? "border-blue-500 bg-blue-50" : "hover:bg-slate-50"}`}
            onClick={() => { setSelectedStudentId(s.id); fetchStudentDocs(s.id); }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{s.name}</p>
                <p className="text-xs text-muted-foreground">Adm: {s.admission_no} · {s.class_name} · 📞 {s.parent_contact || "N/A"}</p>
              </div>
              <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteStudent(s.id); }} className="text-destructive border-destructive hover:bg-destructive/10">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* DOCUMENTS SECTION - shows when student is selected */}
            {selectedStudentId === s.id && (
              <div className="space-y-3 border-t pt-3">
                <h5 className="text-xs font-semibold text-slate-700">📎 Documents</h5>

                {/* Upload new doc */}
                <div className="space-y-2 bg-slate-50 rounded-md p-3">
                  <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                    <option>Birth Certificate</option>
                    <option>JSS Result Slip</option>
                    <option>Transfer Letter</option>
                    <option>Medical Certificate</option>
                    <option>Parent ID Copy</option>
                    <option>Other</option>
                  </select>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="text-sm" />
                  {docFile && <p className="text-xs text-green-600">Selected: {docFile.name}</p>}
                  <Button onClick={handleUploadDoc} disabled={docUploading} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full text-sm">
                    {docUploading ? "Uploading..." : "Upload Document"}
                  </Button>
                </div>

                {/* Existing docs */}
                {studentDocs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No documents uploaded yet.</p>
                ) : (
                  <div className="space-y-1">
                    {studentDocs.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between bg-white border rounded-md px-3 py-2">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{doc.document_name}</p>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">{doc.file_name}</a>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteDoc(doc.id)} className="text-destructive border-destructive hover:bg-destructive/10">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>

</TabsContent>
)}                                                            
                </TabsContent>

                {/* MERIT LIST TAB */}
                <TabsContent value="merit" className="space-y-4">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />Class Merit List
                  </h4>
                  <div className="flex gap-2">
                    <select value={meritClass} onChange={(e) => setMeritClass(e.target.value)} className="border rounded-md px-3 py-2 text-sm flex-1 bg-white">
                      {classNames.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                    <select value={meritTerm} onChange={(e) => setMeritTerm(e.target.value)} className="border rounded-md px-3 py-2 text-sm flex-1 bg-white">
                      {termOptions.map((term) => <option key={term} value={term}>{term}</option>)}
                    </select>
                  </div>
                  {meritList.length > 0 ? (() => {
                    const classTermResults = results.filter((r) => r.className === meritClass && r.term === meritTerm);
                    const subjects = [...new Set(classTermResults.map((r) => r.subject))].sort();
                    const subjectMeans = subjects.map((subject) => {
                      const sr = classTermResults.filter((r) => r.subject === subject);
                      const mean = sr.length > 0 ? Math.round((sr.reduce((s, r) => s + r.marks, 0) / sr.length) * 10) / 10 : 0;
                      return { subject, mean, grade: meritClass === 'Grade 10' ? getGrade10Grade(mean) : getGrade(mean) };
                    });
                    const classOverallMean = meritList.length > 0 ? Math.round((meritList.reduce((s, x) => s + x.average, 0) / meritList.length) * 10) / 10 : 0;
                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-3 py-2 text-left font-semibold whitespace-nowrap">Student</th>
                              {subjects.map((s) => <th key={s} className="border border-gray-200 px-3 py-2 text-center font-semibold whitespace-nowrap">{s}</th>)}
                              <th className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50">Total</th>
                              <th className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50">Mean</th>
                              <th className="border border-gray-200 px-3 py-2 text-center font-semibold bg-blue-50">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {meritList.map((entry, index) => (
                              <tr key={entry.student} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="border border-gray-200 px-3 py-2 font-medium whitespace-nowrap">
                                  {index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : `${index + 1}. `}{entry.student}
                                </td>
                                {subjects.map((subject) => {
                                  const r = classTermResults.find((r) => r.student === entry.student && r.subject === subject);
                                  return (
                                    <td key={subject} className="border border-gray-200 px-3 py-2 text-center">
                                      {r ? <span>{r.marks}<br /><span className="text-xs text-muted-foreground">{meritClass === 'Grade 10' ? getGrade10Grade(r.marks) : getGrade(r.marks)}</span></span> : <span className="text-gray-300">—</span>}
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
                                <td key={subject} className="border border-gray-200 px-3 py-2 text-center">{mean}<br /><span className="text-xs">{grade}</span></td>
                              ))}
                              <td className="border border-gray-200 px-3 py-2 text-center bg-yellow-100">—</td>
                              <td className="border border-gray-200 px-3 py-2 text-center bg-yellow-100">{classOverallMean}</td>
                              <td className="border border-gray-200 px-3 py-2 text-center font-semibold bg-yellow-100">{meritClass === 'Grade 10' ? getGrade10Grade(classOverallMean) : getGrade(classOverallMean)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })() : <p className="text-sm text-muted-foreground">No results found for {meritClass} — {meritTerm}.</p>}
                </TabsContent>

                {/* MATERIALS TAB */}
                <TabsContent value="materials" className="space-y-4">
                  <h4 className="font-medium text-sm">Post New Material</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <select value={matClass} onChange={(e) => setMatClass(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-white">
                        {classNames.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                        <option value="All Classes">All Classes</option>
                      </select>
                      <select value={matSubject} onChange={(e) => setMatSubject(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-white">
                        {lecturerSubjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                      </select>
                    </div>
                    <input placeholder="Title" value={matTitle} onChange={(e) => setMatTitle(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    <textarea placeholder="Notes or instructions..." value={matContent} onChange={(e) => setMatContent(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm min-h-[100px] bg-white" />
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Upload PDF or file (optional)</p>
                      <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png" onChange={(e) => setMatFile(e.target.files?.[0] || null)} className="text-sm" />
                      {matFile && <p className="text-xs text-green-600 mt-1">Selected: {matFile.name}</p>}
                    </div>
                    <input placeholder="Description (optional)" value={matDesc} onChange={(e) => setMatDesc(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    <Button onClick={handlePostMaterial} disabled={matUploading} className="bg-[#1a56a0] hover:bg-[#154a8a]">
                      <Plus className="h-4 w-4 mr-2" />{matUploading ? "Posting..." : "Post Material"}
                    </Button>
                  </div>
                  <h4 className="font-medium text-sm mt-4">Posted Materials</h4>
                  {materials.filter((m) => m.teacher_name === lecturer.name).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No materials posted yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {materials.filter((m) => m.teacher_name === lecturer.name).map((m) => (
                        <div key={m.id} className="border rounded-md p-3 space-y-1 bg-white">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{m.title}</p>
                            <Button variant="outline" size="sm" onClick={() => onDeleteMaterial(m.id)} className="text-destructive border-destructive hover:bg-destructive/10">Delete</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">{m.subject} · {m.class_name} · {new Date(m.created_at).toLocaleDateString()}</p>
                          {m.content && <p className="text-sm text-muted-foreground line-clamp-2">{m.content}</p>}
                          {m.file_url && <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">📎 {m.file_name}</a>}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* TIMETABLES TAB */}
                <TabsContent value="timetables" className="space-y-6">
                  {lecturer.name === "Mr. Osman Halake" && (
                    <div className="space-y-3 border rounded-md p-4 bg-muted/30">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />Upload New Timetable
                      </h4>
                      <select value={ttType} onChange={(e) => setTtType(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                        <option value="teaching">Teaching Timetable</option>
                        <option value="exam">Exam Timetable</option>
                      </select>
                      <select value={ttTerm} onChange={(e) => setTtTerm(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                        {termOptions.map((term) => <option key={term} value={term}>{term}</option>)}
                      </select>
                      <input placeholder="Title" value={ttTitle} onChange={(e) => setTtTitle(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setTtFile(e.target.files?.[0] || null)} className="text-sm" />
                      {ttFile && <p className="text-xs text-green-600 font-medium">Selected: {ttFile.name}</p>}
                      <Button onClick={handleUploadTimetable} disabled={ttUploading} className="bg-[#1a56a0] hover:bg-[#154a8a]">
                        {ttUploading ? "Uploading..." : "Upload Timetable"}
                      </Button>
                    </div>
                  )}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base text-slate-800 border-b pb-1">Teaching Timetables</h4>
                    {timetables.filter((t) => t.type === "teaching").length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No teaching timetables posted.</p>
                    ) : timetables.filter((t) => t.type === "teaching").map((t) => (
                      <div key={t.id} className="border rounded-lg bg-white p-4 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-semibold text-md text-slate-900">{t.title}</p>
                            <p className="text-xs text-muted-foreground">{t.term} · {new Date(t.created_at).toLocaleDateString()}</p>
                          </div>
                          {lecturer.name === "Mr. Osman Halake" && (
                            <Button variant="outline" size="sm" onClick={() => onDeleteTimetable(t.id)} className="text-destructive border-destructive hover:bg-destructive/10 flex items-center gap-1">
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          )}
                        </div>
                        {isImageFile(t.file_name) ? (
                          <div className="border rounded-md overflow-hidden bg-slate-50 p-2 flex justify-center max-h-[700px]">
                            <img src={t.file_url} alt={t.title} className="object-contain max-w-full h-auto rounded-md shadow-sm" loading="eager" />
                          </div>
                        ) : (
                          <div className="border rounded-md bg-slate-50 p-4 flex flex-col items-center justify-center text-center space-y-2 min-h-[200px]">
                            <FileText className="h-10 w-10 text-slate-400" />
                            <div className="text-sm font-medium text-slate-700">{t.file_name}</div>
                            <a href={t.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline font-medium">View Document</a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 pt-4">
                    <h4 className="font-semibold text-base text-slate-800 border-b pb-1">Exam Timetables</h4>
                    {timetables.filter((t) => t.type === "exam").length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No exam timetables posted.</p>
                    ) : timetables.filter((t) => t.type === "exam").map((t) => (
                      <div key={t.id} className="border rounded-lg bg-white p-4 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-semibold text-md text-slate-900">{t.title}</p>
                            <p className="text-xs text-muted-foreground">{t.term} · {new Date(t.created_at).toLocaleDateString()}</p>
                          </div>
                          {lecturer.name === "Mr. Osman Halake" && (
                            <Button variant="outline" size="sm" onClick={() => onDeleteTimetable(t.id)} className="text-destructive border-destructive hover:bg-destructive/10 flex items-center gap-1">
                              <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                          )}
                        </div>
                        {isImageFile(t.file_name) ? (
                          <div className="border rounded-md overflow-hidden bg-slate-50 p-2 flex justify-center max-h-[700px]">
                            <img src={t.file_url} alt={t.title} className="object-contain max-w-full h-auto rounded-md shadow-sm" loading="eager" />
                          </div>
                        ) : (
                          <div className="border rounded-md bg-slate-50 p-4 flex flex-col items-center justify-center text-center space-y-2 min-h-[200px]">
                            <FileText className="h-10 w-10 text-slate-400" />
                            <div className="text-sm font-medium text-slate-700">{t.file_name}</div>
                            <a href={t.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline font-medium">View Document</a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {lecturer.name === "Mr. Osman Halake" && (
                    <div className="space-y-3 border rounded-md p-4 bg-slate-50/50 mt-6">
                      <h4 className="font-semibold text-sm text-blue-950">⚙️ Feed Public Calendar Dates to Homepage</h4>
                      <p className="text-xs text-muted-foreground">Update the visual calendar on the homepage for Term 2.</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label className="text-xs font-semibold">Opening Date</Label>
                          <input placeholder="e.g. April 29, 2026" value={newOpeningDate} onChange={(e) => setNewOpeningDate(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                        <div><Label className="text-xs font-semibold">IDD Break</Label>
                          <input placeholder="e.g. May 26 - May 29, 2026" value={newIddBreak} onChange={(e) => setNewIddBreak(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label className="text-xs font-semibold">Mid-Term Exam</Label>
                          <input placeholder="e.g. June 21 - June 23, 2026" value={newMidExam} onChange={(e) => setNewMidExam(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                        <div><Label className="text-xs font-semibold">Mid-Term Break</Label>
                          <input placeholder="e.g. June 24 - June 30, 2026" value={newMidBreak} onChange={(e) => setNewMidBreak(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label className="text-xs font-semibold">End-Term Exam</Label>
                          <input placeholder="e.g. July 27 - July 29, 2026" value={newEndExam} onChange={(e) => setNewEndExam(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                        <div><Label className="text-xs font-semibold">Closing Date</Label>
                          <input placeholder="e.g. July 30, 2026" value={newClosingDate} onChange={(e) => setNewClosingDate(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
                      </div>
                      <Button onClick={handleAddTermRow} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full font-semibold mt-2">
                        <Plus className="h-4 w-4 mr-2" /> Upload Calendar Dates to Homepage
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* FEES TAB */}
                {lecturer.name === "Mr. Osman Halake" && (
                  <TabsContent value="fees" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Update Fees</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Total Fees (KSh)</Label>
                          <input type="number" value={feeTotal} onChange={(e) => setFeeTotal(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Amount Paid (KSh)</Label>
                          <input type="number" value={feePaid} onChange={(e) => setFeePaid(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                        </div>
                        <div className="p-3 bg-muted rounded-md text-sm">
                          Balance: <span className="text-destructive font-medium">KSh {(Number(feeTotal) - Number(feePaid)).toLocaleString()}</span>
                        </div>
                        <Button onClick={handleUpdateFees} className="bg-[#1a56a0] hover:bg-[#154a8a]">Update Fees</Button>
                      </div>
                    </div>
                  </TabsContent>
                )}

                {/* EVENTS TAB */}
                {lecturer.name === "Mr. Osman Halake" && (
                  <TabsContent value="events" className="space-y-4">
                    <h4 className="font-medium text-sm">Post New Announcement / Event / Notice</h4>
                    <div className="space-y-2">
                      <select value={evtType} onChange={(e) => setEvtType(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                        <option value="announcement">📢 Announcement</option>
                        <option value="event">🗓️ Upcoming Event</option>
                        <option value="notice">📋 School Notice</option>
                      </select>
                      <input placeholder="Title" value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      <textarea placeholder="Description (optional)" value={evtDesc} onChange={(e) => setEvtDesc(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] bg-white" />
                      <input placeholder="Date (e.g. June 5, 2026)" value={evtDate} onChange={(e) => setEvtDate(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      <Button onClick={handlePostEvent} className="bg-blue-700 hover:bg-blue-800 text-white w-full">
                        <Plus className="h-4 w-4 mr-2" /> Post to Homepage Sidebar
                      </Button>
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
