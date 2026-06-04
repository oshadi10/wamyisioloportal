"use client";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Trophy, Calendar, FileText, CheckCircle2, XCircle, HelpCircle, Lock, Loader2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { classStudents, Lecturer, Result, FeeRecord, getGrade, getGrade10Grade, termOptions } from "@/lib/school-data";

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

const CLASS_TEACHERS: Record<string, string> = {
  "Form 3": "dennis",
  "Form 4": "guyo",
  "Grade 10": "selina",
};

export function StaffPortal({
  lecturer, results, fees, onUploadResult, onDeleteResult, onUpdateFees,
  materials, onPostMaterial, onDeleteMaterial, timetables, onUploadTimetable,
  onDeleteTimetable, onUploadTermDate,
}: StaffPortalProps) {
  const classNames = Object.keys(classStudents);
  const [selectedClass, setSelectedClass] = useState(classNames[0]);
  const [selectedStudent, setSelectedStudent] = useState(classStudents[classNames[0]][0]);
  const [activeTab, setActiveTab] = useState("results");
  
  const lecturerSubjects = lecturer?.subject ? lecturer.subject.split(" / ") : ["General"];
  const [newSubject, setNewSubject] = useState(lecturerSubjects[0] || "");
  const [newMarks, setNewMarks] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newTerm, setNewTerm] = useState("Term 1, 2026");
  const [meritClass, setMeritClass] = useState(classNames[0]);
  const [meritTerm, setMeritTerm] = useState("Term 1, 2026");
  
  // Isolated Content state configurations
  const [matTitle, setMatTitle] = useState("");
  const [matDesc, setMatDesc] = useState("");
  const [matClass, setMatClass] = useState(classNames[0]);
  const [matSubject, setMatSubject] = useState(lecturerSubjects[0] || "");
  const [matContent, setMatContent] = useState("");
  
  const [ttTitle, setTtTitle] = useState("");
  const [ttTerm, setTtTerm] = useState("Term 1, 2026");
  const [ttContent, setTtContent] = useState("");
  const [ttType, setTtType] = useState("teaching");

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

  const [feeTotal, setFeeTotal] = useState("45000");
  const [feePaid, setFeePaid] = useState("30000");

  const [students, setStudents] = useState<any[]>([]);
  const [stdName, setStdName] = useState("");
  const [stdClass, setStdClass] = useState(classNames[0]);
  const [stdAdmissionNo, setStdAdmissionNo] = useState("");
  const [stdParent, setStdParent] = useState("");
  const [stdRegistering, setStdRegistering] = useState(false);

  const SYSTEM_TODAY = new Date().toISOString().split("T")[0];
  const [attDate, setAttDate] = useState(SYSTEM_TODAY);
  const [attRecords, setAttRecords] = useState<Record<string, { am: string; pm: string }>>({});
  const [isClassSubmitted, setIsClassSubmitted] = useState(false);
  const [teacherLogs, setTeacherLogs] = useState<any[]>([]);
  const [logDate, setLogDate] = useState(SYSTEM_TODAY);
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [logClass, setLogClass] = useState(classNames[0]);
  const [logSubject, setLogSubject] = useState(lecturerSubjects[0] || "");
  const [logTopic, setLogTopic] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [logSaving, setLogSaving] = useState(false);
  
  const [occurrences, setOccurrences] = useState<any[]>([]);
  const [occDate, setOccDate] = useState(SYSTEM_TODAY);
  const [occTime, setOccTime] = useState("");
  const [occCategory, setOccCategory] = useState("discipline");
  const [occTitle, setOccTitle] = useState("");
  const [occDesc, setOccDesc] = useState("");
  const [occAction, setOccAction] = useState("");
  const [occStudents, setOccStudents] = useState("");
  const [occSeverity, setOccSeverity] = useState("normal");
  const [occSaving, setOccSaving] = useState(false);

  const [prefects, setPrefects] = useState<any[]>([]);
  const [newPrefectName, setNewPrefectName] = useState("");
  const [newPrefectRole, setNewPrefectRole] = useState("");
  const [editingPrefectId, setEditingPrefectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingRole, setEditingRole] = useState("");
  const [prefectsSaving, setPrefectsSaving] = useState(false);

  const isAdmin = lecturer?.name === "Mr. Osman Halake";
  const isClassTeacher = isAdmin || (lecturer?.id && CLASS_TEACHERS[selectedClass] === lecturer.id);
  const isSameDay = attDate === SYSTEM_TODAY;
  const canMarkAttendance = isAdmin ? isSameDay : (isClassTeacher && isSameDay && !isClassSubmitted);

  // Sync fee inputs whenever student updates
  useEffect(() => {
    if (selectedStudent && fees) {
      setFeeTotal((fees[selectedStudent]?.total || 45000).toString());
      setFeePaid((fees[selectedStudent]?.paid || 30000).toString());
    }
  }, [selectedStudent, fees]);

  useEffect(() => {
    if (activeTab === "students") fetchStudents();
    if (activeTab === "attendance") fetchAttendance();
    if (activeTab === "prefects") fetchPrefects();
    if (activeTab === "occurrence") fetchOccurrences();
  }, [activeTab, selectedClass, attDate]);

  useEffect(() => {
    if (activeTab === "mylog") fetchTeacherLogs();
  }, [activeTab, logDate]);

  const fetchPrefects = async () => {
    const { data, error } = await supabase.from("prefects").select("*").order("created_at", { ascending: true });
    if (!error && data) setPrefects(data);
  };

  const handleAddPrefect = async () => {
    if (!newPrefectName.trim() || !newPrefectRole.trim()) return;
    setPrefectsSaving(true);
    const { error } = await supabase.from("prefects").insert({ name: newPrefectName.trim(), role: newPrefectRole.trim() });
    if (!error) await fetchPrefects();
    setNewPrefectName(""); setNewPrefectRole("");
    setPrefectsSaving(false);
  };

  const handleDeletePrefect = async (id: string) => {
    if (!confirm("Remove this prefect?")) return;
    const { error } = await supabase.from("prefects").delete().eq("id", id);
    if (!error) await fetchPrefects();
  };

  const handleSavePrefectEdit = async () => {
    if (!editingName.trim() || !editingRole.trim()) return;
    const { error } = await supabase.from("prefects").update({ name: editingName.trim(), role: editingRole.trim() }).eq("id", editingPrefectId);
    if (!error) await fetchPrefects();
    setEditingPrefectId(null);
  };

  const fetchTeacherLogs = async () => {
    const { data, error } = await supabase.from("teacher_logs").select("*").eq("log_date", logDate).order("created_at", { ascending: false });
    if (!error && data) setTeacherLogs(data);
  };

  const handleSubmitLog = async () => {
    if (!timeIn.trim() || !logTopic.trim()) return alert("Fill required log fields.");
    setLogSaving(true);
    await supabase.from("teacher_logs").insert({
      teacher_name: lecturer?.name || "Unknown Teacher", log_date: logDate, time_in: timeIn, time_out: timeOut || null,
      class_name: logClass, subject: logSubject, topic_taught: logTopic, notes: logNotes || null,
    });
    setTimeIn(""); setTimeOut(""); setLogTopic(""); setLogNotes("");
    setLogSaving(false);
    fetchTeacherLogs();
  };

  const handleDeleteLog = async (id: string) => {
    if (confirm("Delete entry?")) { await supabase.from("teacher_logs").delete().eq("id", id); fetchTeacherLogs(); }
  };

  const fetchOccurrences = async () => {
    const { data, error } = await supabase.from("daily_occurrence").select("*").order("log_date", { ascending: false });
    if (!error && data) setOccurrences(data);
  };

  const handleSubmitOccurrence = async () => {
    if (!occTitle.trim() || !occDesc.trim()) return;
    setOccSaving(true);
    await supabase.from("daily_occurrence").insert({
      log_date: occDate, tod_name: lecturer.name, time_of_incident: occTime || null, category: occCategory,
      title: occTitle, description: occDesc, action_taken: occAction || null, students_involved: occStudents || null, severity: occSeverity,
    });
    setOccTitle(""); setOccDesc(""); setOccAction(""); setOccStudents("");
    setOccSaving(false);
    fetchOccurrences();
  };

  const handleDeleteOccurrence = async (id: string) => {
    if (confirm("Delete record?")) { await supabase.from("daily_occurrence").delete().eq("id", id); fetchOccurrences(); }
  };

  const fetchAttendance = async () => {
    setAttRecords({});
    setIsClassSubmitted(false);
    const { data, error } = await supabase.from("student_attendance").select("*").eq("log_date", attDate);
    if (error) return;
    const mapped: Record<string, { am: string; pm: string }> = {};
    let submittedMarker = false;
    data?.forEach((row: any) => {
      mapped[row.student_name] = { am: row.am_status, pm: row.pm_status };
      if (row.class_name === selectedClass && (row.am_status !== "unmarked" || row.pm_status !== "unmarked")) {
        submittedMarker = true;
      }
    });
    setAttRecords(mapped);
    setIsClassSubmitted(submittedMarker);
  };

  const handleToggleAttendance = (studentName: string, session: "am" | "pm") => {
    if (!canMarkAttendance) return;
    const current = attRecords[studentName] || { am: "unmarked", pm: "unmarked" };
    const nextStatus = current[session] === "unmarked" ? "present" : current[session] === "present" ? "absent" : "unmarked";
    setAttRecords(prev => ({ ...prev, [studentName]: { ...current, [session]: nextStatus } }));
  };

  const handleMarkAllGroup = (status: "present" | "absent") => {
    if (!canMarkAttendance) return;
    const updated = { ...attRecords };
    classStudents[selectedClass].forEach(student => { updated[student] = { am: status, pm: status }; });
    setAttRecords(updated);
  };

  const handleFinalSubmissionLock = async () => {
    if (!canMarkAttendance) return;
    if (!confirm("Submit layout registry? Data locks upon commit.")) return;
    for (const student of classStudents[selectedClass] || []) {
      const pair = attRecords[student] || { am: "unmarked", pm: "unmarked" };
      await supabase.from("student_attendance").upsert({
        log_date: attDate, class_name: selectedClass, student_name: student, am_status: pair.am, pm_status: pair.pm,
      }, { onConflict: "log_date,student_name" });
    }
    setIsClassSubmitted(true);
    fetchAttendance();
  };

  const fetchStudents = async () => {
    const { data } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    if (data) setStudents(data);
  };

  const handleRegisterStudent = async () => {
    if (!stdName.trim() || !stdAdmissionNo.trim()) return;
    setStdRegistering(true);
    await supabase.from("students").insert({ name: stdName, class_name: stdClass, admission_no: stdAdmissionNo, parent_contact: stdParent });
    setStdName(""); setStdAdmissionNo(""); setStdParent(""); setStdRegistering(false);
    fetchStudents();
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm("Delete student?")) { await supabase.from("students").delete().eq("id", id); fetchStudents(); }
  };

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    const firstStudent = classStudents[className][0];
    setSelectedStudent(firstStudent);
  };

  const handleStudentSelect = (student: string) => {
    setSelectedStudent(student);
  };

  const handleUploadResult = () => {
    if (!newSubject.trim() || !newMarks.trim()) return alert("Enter fields.");
    const marks = Number(newMarks);
    const grade = newGrade.trim() || (selectedClass === "Grade 10" ? getGrade10Grade(marks) : getGrade(marks));
    onUploadResult({ student: selectedStudent, className: selectedClass, subject: newSubject.trim(), marks, grade, term: newTerm });
    setNewMarks(""); setNewGrade("");
  };

  const handleUpdateFees = () => {
    onUpdateFees(selectedStudent, Number(feeTotal), Number(feePaid));
    alert("Fees updated configuration saved successfully.");
  };

  const handlePostMaterial = () => {
    if (!matTitle.trim()) return alert("Provide resource topic title.");
    onPostMaterial({
      title: matTitle, description: matDesc, subject: matSubject, class_name: matClass,
      teacher_name: lecturer?.name || "Teacher", type: "text", content: matContent, file_url: "", file_name: ""
    });
    setMatTitle(""); setMatDesc(""); setMatContent("");
  };

  const handleUploadTimetable = () => {
    if (!ttTitle.trim()) return alert("Provide configuration title.");
    onUploadTimetable({ type: ttType, title: ttTitle, term: ttTerm, file_url: ttContent, file_name: "Document Link URL" });
    setTtTitle(""); setTtContent("");
  };

  const handlePostEvent = async () => {
    if (!evtTitle.trim()) return alert("Enter title.");
    const { error } = await supabase.from("events").insert({ type: evtType, title: evtTitle, description: evtDesc, date: evtDate || null });
    if (!error) { setEvtTitle(""); setEvtDesc(""); setEvtDate(""); alert("Notice published."); }
  };

  const handleAddTermRow = async () => {
    if (!newOpeningDate || !newClosingDate) return alert("Fill term boundaries.");
    const row = { term: "Term 2, 2026", opening_date: newOpeningDate, idd_date: newIddBreak || "—", midterm_exam: newMidExam || "—", mid_term: newMidBreak || "—", end_term_exam: newEndExam || "—", closing_date: newClosingDate, status: "Current Term" };
    await supabase.from("term_dates").delete().neq("term", "safety_wildcard");
    const { error } = await supabase.from("term_dates").insert(row);
    if (!error) { onUploadTermDate(row); alert("Home dashboard timeline calendar updated."); }
  };

  const getMeritList = () => {
    return classStudents[meritClass].map((student) => {
      const r = results.filter((r) => r.student === student && r.term === meritTerm);
      const totalMarks = r.reduce((sum, r) => sum + r.marks, 0);
      const subjects = r.length;
      const average = subjects > 0 ? Math.round((totalMarks / subjects) * 10) / 10 : 0;
      const overallGrade = subjects > 0 ? (meritClass === "Grade 10" ? getGrade10Grade(average) : getGrade(average)) : "-";
      return { student, totalMarks, subjects, average, overallGrade };
    }).filter((s) => s.subjects > 0).sort((a, b) => b.totalMarks - a.totalMarks);
  };

  const studentResults = results.filter((r) => r.student === selectedStudent);
  const meritList = getMeritList();
  const resultsByTerm = studentResults.reduce((acc, r) => {
    const t = r.term || "Unknown Term";
    if (!acc[t]) acc[t] = [];
    acc[t].push(r);
    return acc;
  }, {} as Record<string, Result[]>);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid md:grid-cols-[320px_1fr] gap-4">

        {/* SIDEBAR NAVIGATION ROSTER PANEL */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Class Lists</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{classNames.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <div className="max-h-[550px] overflow-y-auto space-y-1">
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

        {/* MAIN MULTI-TAB WORKSPACE HUB */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 flex flex-wrap gap-1 h-auto bg-muted p-1 rounded-lg">
                  <TabsTrigger value="results" className="text-xs px-2.5 py-1.5">Results</TabsTrigger>
                  <TabsTrigger value="attendance" className="text-xs px-2.5 py-1.5">📅 Attendance</TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs px-2.5 py-1.5">🔒 Secure Folders</TabsTrigger>
                  <TabsTrigger value="merit" className="text-xs px-2.5 py-1.5"><Trophy className="h-3 w-3 mr-1" />Merit List</TabsTrigger>
                  <TabsTrigger value="materials" className="text-xs px-2.5 py-1.5">📚 Materials</TabsTrigger>
                  <TabsTrigger value="timetables" className="text-xs px-2.5 py-1.5">📅 Timetables</TabsTrigger>
                  {isAdmin && <TabsTrigger value="fees" className="text-xs px-2.5 py-1.5">Fees</TabsTrigger>}
                  {isAdmin && <TabsTrigger value="events" className="text-xs px-2.5 py-1.5">📣 Events</TabsTrigger>}
                  {isAdmin && <TabsTrigger value="students" className="text-xs px-2.5 py-1.5">🎓 Students</TabsTrigger>}
                  <TabsTrigger value="prefects" className="text-xs px-2.5 py-1.5">🏅 Prefects</TabsTrigger>
                  <TabsTrigger value="mylog" className="text-xs px-2.5 py-1.5">📋 My Log</TabsTrigger>
                  <TabsTrigger value="occurrence" className="text-xs px-2.5 py-1.5">📖 Occurrence</TabsTrigger>
                </TabsList>

                {/* 1. EXAM TRACKING SHEET HUB */}
                <TabsContent value="results" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Upload Result for {selectedStudent}</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                      <div>
                        <Label>Subject</Label>
                        <Select value={newSubject} onValueChange={setNewSubject}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{lecturerSubjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Marks</Label>
                        <Input type="number" value={newMarks} onChange={(e) => setNewMarks(e.target.value)} placeholder="e.g. 78" />
                      </div>
                      <div>
                        <Label>Term Context</Label>
                        <Select value={newTerm} onValueChange={setNewTerm}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{termOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleUploadResult} className="bg-[#378add] hover:bg-[#2c72b8] text-white">Upload</Button>
                    </CardContent>
                  </Card>

                  {Object.keys(resultsByTerm).length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">No examination records set up for this student.</div>
                  ) : (
                    Object.entries(resultsByTerm).map(([term, list]) => (
                      <Card key={term}>
                        <CardHeader><CardTitle className="text-base text-primary font-bold">{term}</CardTitle></CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead><TableHead className="w-[80px]"></TableHead></TableRow></TableHeader>
                            <TableBody>
                              {list.map((r, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-medium">{r.subject}</TableCell>
                                  <TableCell>{r.marks}%</TableCell>
                                  <TableCell><span className="px-2 py-0.5 rounded text-xs font-bold bg-muted">{r.grade}</span></TableCell>
                                  <TableCell>
                                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => onDeleteResult(r.student, r.subject, r.term)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* 2. ATTENDANCE MANAGEMENT CONTROLS */}
                <TabsContent value="attendance" className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Target Date:</span>
                      <Input type="date" value={attDate} onChange={(e) => setAttDate(e.target.value)} className="w-auto font-mono" />
                    </div>
                    <div className={cn("text-xs font-mono px-3 py-1.5 rounded-full border font-bold", canMarkAttendance ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-amber-50 border-amber-300 text-amber-700")}>
                      {canMarkAttendance ? "✏️ Editing Enabled" : "🔒 View Only Mode"}
                    </div>
                    <div className="sm:ml-auto flex gap-2">
                      {canMarkAttendance && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleMarkAllGroup("present")} className="text-emerald-700 border-emerald-200">✓ All Present</Button>
                          <Button variant="outline" size="sm" onClick={() => handleMarkAllGroup("absent")} className="text-rose-700 border-rose-200">✗ All Absent</Button>
                          <Button size="sm" onClick={handleFinalSubmissionLock} className="bg-emerald-600 hover:bg-emerald-700 text-white">Commit Registry</Button>
                        </>
                      )}
                    </div>
                  </div>

                  <Card>
                    <CardHeader><CardTitle className="text-base">Roll Call Register — {selectedClass}</CardTitle></CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader><TableRow><TableHead>Student Name</TableHead><TableHead className="text-center">Morning (AM)</TableHead><TableHead className="text-center">Afternoon (PM)</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {classStudents[selectedClass].map((student) => {
                            const record = attRecords[student] || { am: "unmarked", pm: "unmarked" };
                            return (
                              <TableRow key={student}>
                                <TableCell className="font-medium">{student}</TableCell>
                                <TableCell className="text-center">
                                  <Button size="sm" variant="outline" onClick={() => handleToggleAttendance(student, "am")} disabled={!canMarkAttendance}
                                    className={cn("w-28 text-xs font-semibold", record.am === "present" ? "bg-emerald-500 text-white border-transparent" : record.am === "absent" ? "bg-rose-500 text-white border-transparent" : "bg-secondary text-secondary-foreground")}>
                                    {record.am.toUpperCase()}
                                  </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button size="sm" variant="outline" onClick={() => handleToggleAttendance(student, "pm")} disabled={!canMarkAttendance}
                                    className={cn("w-28 text-xs font-semibold", record.pm === "present" ? "bg-emerald-500 text-white border-transparent" : record.pm === "absent" ? "bg-rose-500 text-white border-transparent" : "bg-secondary text-secondary-foreground")}>
                                    {record.pm.toUpperCase()}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 3. CONFIDENTIAL STORAGE VAULT FOLDERS */}
                <TabsContent value="documents" className="space-y-4">
                  <ProtectedDocumentManager studentId={selectedStudent} studentName={selectedStudent} currentUserRole={isAdmin ? "principal" : "teacher"} currentUserId={lecturer?.id || "staff_user"} />
                </TabsContent>

                {/* 4. PERFORMANCE RANK MATRIX */}
                <TabsContent value="merit" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Classroom Leaderboard Dashboard</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-3 items-end">
                      <div>
                        <Label>Class</Label>
                        <Select value={meritClass} onValueChange={setMeritClass}>
                          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                          <SelectContent>{classNames.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Term Context</Label>
                        <Select value={meritTerm} onValueChange={setMeritTerm}>
                          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                          <SelectContent>{termOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      {meritList.length === 0 ? (
                        <div className="text-center p-6 text-muted-foreground">No tracking entries match this active timeline setup.</div>
                      ) : (
                        <Table>
                          <TableHeader><TableRow><TableHead className="w-[60px]">Rank</TableHead><TableHead>Student Name</TableHead><TableHead>Aggregated Score</TableHead><TableHead>Average</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
                          <TableBody>
                            {meritList.map((row, index) => (
                              <TableRow key={index} className={cn(index === 0 && "bg-amber-50/70 font-semibold")}>
                                <TableCell className="font-bold text-center">{index + 1}</TableCell>
                                <TableCell>{row.student}</TableCell>
                                <TableCell>{row.totalMarks}</TableCell>
                                <TableCell>{row.average}%</TableCell>
                                <TableCell><span className="px-2 py-0.5 rounded text-xs font-bold bg-muted">{row.overallGrade}</span></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 5. COURSE MATERIALS UPLOADER */}
                <TabsContent value="materials" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Publish Syllabus Handouts & Resource Notes</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Title</Label><Input value={matTitle} onChange={(e) => setMatTitle(e.target.value)} placeholder="e.g. Assignment 3" /></div>
                        <div><Label>Subject Scope</Label><Input value={matSubject} onChange={(e) => setMatSubject(e.target.value)} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Class Target</Label>
                          <Select value={matClass} onValueChange={setMatClass}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{classNames.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Web Resource URL Link</Label>
                          <Input value={matContent} onChange={(e) => setMatContent(e.target.value)} placeholder="https://drive.google.com/..." />
                        </div>
                      </div>
                      <div><Label>Description Brief</Label><Textarea value={matDesc} onChange={(e) => setMatDesc(e.target.value)} placeholder="Summary overview notes..." rows={2} /></div>
                      <Button onClick={handlePostMaterial} className="bg-[#378add] text-white">Post Resource Material</Button>
                    </CardContent>
                  </Card>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {materials.map((m) => (
                      <Card key={m.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div><CardTitle className="text-sm font-bold">{m.title}</CardTitle><p className="text-xs text-muted-foreground">{m.subject} — {m.class_name}</p></div>
                            <Button size="icon" variant="ghost" onClick={() => onDeleteMaterial(m.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs mb-2 text-muted-foreground">{m.description}</p>
                          {m.content && <a href={m.content} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline break-all block font-mono">{m.content}</a>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* 6. TIMETABLE SCHEDULE SYNC */}
                <TabsContent value="timetables" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Publish Academic Calendars / Blocks</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Title</Label><Input value={ttTitle} onChange={(e) => setTtTitle(e.target.value)} placeholder="e.g. Form 4 Master Block" /></div>
                        <div><Label>Term Context</Label><Input value={ttTerm} onChange={(e) => setTtTerm(e.target.value)} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Schedule Classification Type</Label>
                          <Select value={ttType} onValueChange={setTtType}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="teaching">Routine Class Schedule</SelectItem><SelectItem value="exam">Examination Matrix</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Document Web URL Link</Label>
                          <Input value={ttContent} onChange={(e) => setTtContent(e.target.value)} placeholder="https://..." />
                        </div>
                      </div>
                      <Button onClick={handleUploadTimetable} className="bg-[#378add] text-white">Save Entry</Button>
                    </CardContent>
                  </Card>

                  <Table>
                    <TableHeader><TableRow><TableHead>Scope Schedule Name</TableHead><TableHead>Term</TableHead><TableHead>Type</TableHead><TableHead className="w-[80px]"></TableHead></TableRow></TableHeader>
                    <TableBody>
                      {timetables.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">
                            {t.file_url ? <a href={t.file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{t.title}</a> : t.title}
                          </TableCell>
                          <TableCell>{t.term}</TableCell>
                          <TableCell className="capitalize">{t.type}</TableCell>
                          <TableCell><Button size="icon" variant="ghost" onClick={() => onDeleteTimetable(t.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* 7. BILLING ACCOUNTS FINANCIALS */}
                {isAdmin && (
                  <TabsContent value="fees" className="space-y-4">
                    <Card>
                      <CardHeader><CardTitle className="text-base">Financial Account Ledger Balance for: {selectedStudent}</CardTitle></CardHeader>
                      <CardContent className="grid sm:grid-cols-3 gap-4 items-end">
                        <div><Label>Required Base Term Fees</Label><Input type="number" value={feeTotal} onChange={(e) => setFeeTotal(e.target.value)} /></div>
                        <div><Label>Paid Receipts Aggregate</Label><Input type="number" value={feePaid} onChange={(e) => setFeePaid(e.target.value)} /></div>
                        <Button onClick={handleUpdateFees} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Ledger Status</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* 8. MASTER SCHEDULER BOARD EVENTS */}
                {isAdmin && (
                  <TabsContent value="events" className="space-y-4">
                    <Card>
                      <CardHeader><CardTitle className="text-base">System Calendar Notice Boards</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        <div><Label>Headline Notice Title</Label><Input value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} /></div>
                        <div><Label>Notice Context Body Brief</Label><Textarea value={evtDesc} onChange={(e) => setEvtDesc(e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label>Category</Label>
                            <Select value={evtType} onValueChange={setEvtType}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="announcement">Public Board Notice</SelectItem><SelectItem value="event">Calendar Activity Event</SelectItem></SelectContent>
                            </Select>
                          </div>
                          <div><Label>Target Date Marker</Label><Input type="date" value={evtDate} onChange={(e) => setEvtDate(e.target.value)} /></div>
                        </div>
                        <Button onClick={handlePostEvent} className="bg-[#378add] text-white">Publish Notice</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle className="text-base">Batch Setup Home Dashboard Term Timeline</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div><Label>Opening Date</Label><Input type="date" value={newOpeningDate} onChange={(e) => setNewOpeningDate(e.target.value)} /></div>
                        <div><Label>Idd Break</Label><Input type="date" value={newIddBreak} onChange={(e) => setNewIddBreak(e.target.value)} /></div>
                        <div><Label>Mid-Term Exams</Label><Input type="date" value={newMidExam} onChange={(e) => setNewMidExam(e.target.value)} /></div>
                        <div><Label>Mid-Term Break</Label><Input type="date" value={newMidBreak} onChange={(e) => setNewMidBreak(e.target.value)} /></div>
                        <div><Label>End-Term Exams</Label><Input type="date" value={newEndExam} onChange={(e) => setNewEndExam(e.target.value)} /></div>
                        <div><Label>Closing Date</Label><Input type="date" value={newClosingDate} onChange={(e) => setNewClosingDate(e.target.value)} /></div>
                        <div className="col-span-full pt-2"><Button onClick={handleAddTermRow} className="w-full bg-[#006B3C] text-white hover:bg-[#00542e]">Overwrite Dashboard Calendar</Button></div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* 9. ADMISSIONS PROFILES HUB */}
                {isAdmin && (
                  <TabsContent value="students" className="space-y-4">
                    <Card>
                      <CardHeader><CardTitle className="text-base">Enroll New Admission Profile</CardTitle></CardHeader>
                      <CardContent className="grid sm:grid-cols-2 gap-3 items-end">
                        <div><Label>Full Student Name</Label><Input value={stdName} onChange={(e) => setStdName(e.target.value)} placeholder="John Doe" /></div>
                        <div><Label>Admission Number</Label><Input value={stdAdmissionNo} onChange={(e) => setStdAdmissionNo(e.target.value)} placeholder="ADM/000/2026" /></div>
                        <div><Label>Assigned Class Stream</Label>
                          <Select value={stdClass} onValueChange={setStdClass}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{classNames.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div><Label>Emergency Contact Number</Label><Input value={stdParent} onChange={(e) => setStdParent(e.target.value)} placeholder="+254..." /></div>
                        <Button onClick={handleRegisterStudent} disabled={stdRegistering} className="col-span-full bg-emerald-600 text-white">Commit Profile Registration</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle className="text-base">Active Enrolled Registry Logs</CardTitle></CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader><TableRow><TableHead>Admission No</TableHead><TableHead>Student Name</TableHead><TableHead>Class Stream</TableHead><TableHead className="w-[80px]"></TableHead></TableRow></TableHeader>
                          <TableBody>
                            {students.map((s) => (
                              <TableRow key={s.id}>
                                <TableCell className="font-mono font-semibold">{s.admission_no}</TableCell>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>{s.class_name}</TableCell>
                                <TableCell><Button size="icon" variant="ghost" onClick={() => handleDeleteStudent(s.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* 10. STUDENT COUNCIL PREFECT LEADERSHIP CABINET */}
                <TabsContent value="prefects" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Council Appointment Ledger</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div><Label>Prefect Student Name</Label><Input value={newPrefectName} onChange={(e) => setNewPrefectName(e.target.value)} placeholder="e.g. Alex Ogendi" /></div>
                        <div><Label>Council Portfolio Duty Role</Label><Input value={newPrefectRole} onChange={(e) => setNewPrefectRole(e.target.value)} placeholder="e.g. School Captain" /></div>
                        <Button onClick={handleAddPrefect} disabled={prefectsSaving} className="bg-[#378add] text-white">Add Appointee</Button>
                      </div>

                      <Table>
                        <TableHeader><TableRow><TableHead>Council Appointee Officer</TableHead><TableHead>Assigned Council Portfolio</TableHead><TableHead className="w-[100px] text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {prefects.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell className="font-medium">
                                {editingPrefectId === p.id ? <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} /> : p.name}
                              </TableCell>
                              <TableCell>
                                {editingPrefectId === p.id ? <Input value={editingRole} onChange={(e) => setEditingRole(e.target.value)} /> : <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{p.role}</span>}
                              </TableCell>
                              <TableCell className="text-right space-x-1">
                                {editingPrefectId === p.id ? (
                                  <Button size="sm" onClick={handleSavePrefectEdit} className="bg-emerald-600 text-white">Save</Button>
                                ) : (
                                  <Button size="icon" variant="ghost" onClick={() => { setEditingPrefectId(p.id); setEditingName(p.name); setEditingRole(p.role); }}><Edit className="h-4 w-4" /></Button>
                                )}
                                <Button size="icon" variant="ghost" onClick={() => handleDeletePrefect(p.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 11. INSTRUCTOR CLASSROOM WORK LOG SHEET */}
                <TabsContent value="mylog" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base">File Instructor Daily Lesson Log Sheet</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div><Label>Log Activity Date</Label><Input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} /></div>
                        <div><Label>Time Stamp In</Label><Input type="time" value={timeIn} onChange={(e) => setTimeIn(e.target.value)} /></div>
                        <div><Label>Time Stamp Out</Label><Input type="time" value={timeOut} onChange={(e) => setTimeOut(e.target.value)} /></div>
                        <div><Label>Class Target</Label>
                          <Select value={logClass} onValueChange={setLogClass}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{classNames.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><Label>Subject Scope</Label>
                          <Select value={logSubject} onValueChange={setLogSubject}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{lecturerSubjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div><Label>Syllabus Subtopic Objective Taught</Label><Input value={logTopic} onChange={(e) => setLogTopic(e.target.value)} placeholder="e.g. Quadratic Formula Matrix" /></div>
                      </div>
                      <div><Label>Instructor Comments / Evaluation Remarks</Label><Textarea value={logNotes} onChange={(e) => setLogNotes(e.target.value)} rows={2} /></div>
                      <Button onClick={handleSubmitLog} disabled={logSaving} className="bg-emerald-600 text-white">Save Work Log Entry</Button>
                    </CardContent>
                  </Card>

                  <Table>
                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Instructor</TableHead><TableHead>Subject</TableHead><TableHead>Topic Objective Covered</TableHead><TableHead className="w-[80px]"></TableHead></TableRow></TableHeader>
                    <TableBody>
                      {teacherLogs.map((l) => (
                        <TableRow key={l.id}>
                          <TableCell className="font-mono text-xs">{l.log_date}</TableCell>
                          <TableCell className="font-medium text-xs">{l.teacher_name}</TableCell>
                          <TableCell className="text-xs">{l.subject} ({l.class_name})</TableCell>
                          <TableCell className="text-xs font-mono">{l.topic_taught}</TableCell>
                          <TableCell><Button size="icon" variant="ghost" onClick={() => handleDeleteLog(l.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* 12. INCIDENT & CAMPUS OCCURRENCE RECORD SHEET */}
                <TabsContent value="occurrence" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Record Discipline Incident / Campus Occurrence Log</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div><Label>Incident Date</Label><Input type="date" value={occDate} onChange={(e) => setOccDate(e.target.value)} /></div>
                        <div><Label>Time Tracker</Label><Input type="time" value={occTime} onChange={(e) => setOccTime(e.target.value)} /></div>
                        <div><Label>Classification</Label>
                          <Select value={occCategory} onValueChange={setOccCategory}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="discipline">Discipline Breach Case</SelectItem><SelectItem value="health">Medical Clinic Incident</SelectItem><SelectItem value="general">General Campus Notice</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div><Label>Risk Severity Escalation</Label>
                          <Select value={occSeverity} onValueChange={setOccSeverity}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="normal">Normal Routine</SelectItem><SelectItem value="medium">Medium Warning Action</SelectItem><SelectItem value="critical">Critical Principal Escalation</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><Label>Students Involved Profile List</Label><Input value={occStudents} onChange={(e) => setOccStudents(e.target.value)} placeholder="Comma-separated student names..." /></div>
                        <div><Label>Incident Case Headline Subject</Label><Input value={occTitle} onChange={(e) => setOccTitle(e.target.value)} placeholder="e.g. Noise during night session prep" /></div>
                      </div>
                      <div><Label>Detailed Account Narrative Case Brief</Label><Textarea value={occDesc} onChange={(e) => setOccDesc(e.target.value)} rows={2} /></div>
                      <div><Label>Immediate Redress Action / Penalty Taken</Label><Input value={occAction} onChange={(e) => setOccAction(e.target.value)} placeholder="e.g. Cleaned laboratory hallway floors" /></div>
                      <Button onClick={handleSubmitOccurrence} disabled={occSaving} className="bg-rose-600 hover:bg-rose-700 text-white">File Incident Report</Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    {occurrences.map((o) => (
                      <Card key={o.id} className={cn("border-l-4", o.severity === "critical" ? "border-l-red-500" : o.severity === "medium" ? "border-l-amber-500" : "border-l-slate-400")}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-sm font-bold">{o.title}</CardTitle>
                              <p className="text-xs text-muted-foreground">{o.log_date} at {o.time_of_incident || "—"} | Filed By: {o.tod_name}</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteOccurrence(o.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1 text-slate-700">
                          <p><strong>Involved Profile:</strong> {o.students_involved || "—"}</p>
                          <p><strong>Description Details:</strong> {o.description}</p>
                          <p><strong>Resolution:</strong> {o.action_taken || "—"}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CONFIDENTIAL STUDENT DOCUMENT MANAGER
// ==========================================
interface ProtectedDocumentManagerProps {
  studentId: string;       
  studentName: string;     
  currentUserRole: string; 
  currentUserId: string;   
}

export function ProtectedDocumentManager({ 
  studentId, 
  studentName, 
  currentUserRole, 
  currentUserId 
}: ProtectedDocumentManagerProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPrincipal = currentUserRole === "principal";
  const isCurrentStudentOwner = currentUserRole === "student" && currentUserId === studentId;
  const hasAccess = isPrincipal || isCurrentStudentOwner;

  const fetchStudentFiles = async () => {
    if (!hasAccess) return;
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("students_documents")
      .list(studentId, { sortBy: { column: "name", order: "asc" } });

    if (!error && data) setFiles(data);
    setLoading(false);
  };

  useEffect(() => {
    if (studentId) fetchStudentFiles();
  }, [studentId, currentUserId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPrincipal) return alert("Unauthorized: Only the Principal can upload files.");
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploading(true);
      const file = event.target.files[0];
      const filePath = `${studentId}/${file.name}`;

      const { error } = await supabase.storage
        .from("students_documents")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;
      fetchStudentFiles(); 
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileName: string) => {
    if (!isPrincipal) return alert("Unauthorized: Only the Principal can delete files.");
    const filePath = `${studentId}/${fileName}`;
    await supabase.storage.from("students_documents").remove([filePath]);
    fetchStudentFiles();
  };

  if (!hasAccess) {
    return (
      <Card className="w-full border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center p-6 text-destructive font-medium">
          <Lock className="w-5 h-5 mr-2" />
          You do not have permission to view or manage documents for this student. Only the Principal has access.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Confidential Student Folder</CardTitle>
          <p className="text-sm text-muted-foreground">
            Viewing files for <strong>{studentName}</strong>
          </p>
        </div>
        {isPrincipal && (
          <div className="relative">
            <input type="file" id="secure-file-upload" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            <label htmlFor="secure-file-upload">
              <Button asChild variant="default" className="cursor-pointer">
                <span>
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Upload Document
                </span>
              </Button>
            </label>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6"><Loader2 className="animate-spin" /></div>
        ) : files.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
            No secure documents found in this folder.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                {isPrincipal && <TableHead className="w-[100px] text-right">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="flex items-center font-medium">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    {file.name}
                  </TableCell>
                  {isPrincipal && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleFileDelete(file.name)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
