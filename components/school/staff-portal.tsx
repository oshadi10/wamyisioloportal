"use client";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Trophy, Calendar, FileText, CheckCircle2, XCircle, HelpCircle, Lock, Loader2 } from "lucide-react";
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
  const [matTitle, setMatTitle] = useState("");
  const [matDesc, setMatDesc] = useState("");
  const [matClass, setMatClass] = useState(classNames[0]);
  const [matSubject, setMatSubject] = useState(lecturerSubjects[0] || "");
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
  const [feeTotal, setFeeTotal] = useState((fees[selectedStudent]?.total || 45000).toString());
  const [feePaid, setFeePaid] = useState((fees[selectedStudent]?.paid || 30000).toString());
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
  const [occFilter, setOccFilter] = useState("all");

  useEffect(() => {
    if (activeTab === "students") fetchStudents();
    if (activeTab === "attendance") fetchAttendance();
    if (activeTab === "prefects") fetchPrefects();
    if (activeTab === "occurrence") fetchOccurrences();
  }, [activeTab, selectedClass, attDate]);

  useEffect(() => {
    if (activeTab === "mylog") fetchTeacherLogs();
  }, [activeTab, logDate]);

  const isAdmin = lecturer?.name === "Mr. Osman Halake";

  const isClassTeacher = 
    isAdmin ||
    (lecturer?.id && CLASS_TEACHERS[selectedClass] === lecturer.id) || 
    (lecturer?.name && lecturer.name.toLowerCase().includes(CLASS_TEACHERS[selectedClass] || ""));
    
  const isSameDay = attDate === SYSTEM_TODAY;
  const canMarkAttendance = isAdmin ? (isClassTeacher && isSameDay) : (isClassTeacher && isSameDay && !isClassSubmitted);
  
  let lockBannerMessage = "";
  if (!isClassTeacher) {
    lockBannerMessage = `🔒 VIEW ONLY MODE: You are authenticated as ${lecturer?.name || "Guest"}. Only the assigned Class Teacher can modify this register.`;
  } else if (!isSameDay) {
    lockBannerMessage = `🔒 LOCKED: Attendance tracking is configured for strict Same-Day logging. Modifying row frames for ${attDate} is restricted.`;
  } else if (isClassSubmitted) {
    lockBannerMessage = `🔒 LOGGED & LOCKED: Today's class registry is securely committed to cloud systems. Corrections or back-edits are prohibited.`;
  }

  const [prefects, setPrefects] = useState([
    { id: "1", name: "Alex Ogendi", role: "School Captain" },
    { id: "2", name: "Yahya Hassan", role: "Ass. Captain" },
    { id: "3", name: "Ramadhan Ekwom", role: "D.H Captain" },
    { id: "4", name: "Shahid Ali", role: "Entertainment Captain" },
    { id: "5", name: "Galgesa Arigele", role: "Dormitory Captain" },
    { id: "6", name: "Casim Lope", role: "Muslim League Chairman" },
    { id: "7", name: "Abdi Ture", role: "Imam" },
    { id: "8", name: "Dida Galma", role: "Environment Captain" },
    { id: "9", name: "Mamo Godana", role: "Bell Ringer" },
    { id: "10", name: "Abubakar Halkano", role: "Lab Captain" },
    { id: "11", name: "Ramadhan Lepir", role: "Games Captain" },
    { id: "12", name: "Bagayo Khalil", role: "Commander" },
    { id: "13", name: "Ramadhan Sabls", role: "Patrol Leader" },
    { id: "14", name: "Musa Mohammed", role: "Form 3 Prefect" },
    { id: "15", name: "John Diyo", role: "Form 4 Prefect" },
    { id: "16", name: "Abdinassir Ibrahim", role: "Grade 10 Prefect" },
  ]);
  const [newPrefectName, setNewPrefectName] = useState("");
  const [newPrefectRole, setNewPrefectRole] = useState("");
  const [editingPrefectId, setEditingPrefectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingRole, setEditingRole] = useState("");
  const [prefectsSaving, setPrefectsSaving] = useState(false);

  const fetchPrefects = async () => {
    const { data, error } = await supabase.from("prefects").select("*").order("created_at", { ascending: true });
    if (!error && data && data.length > 0) setPrefects(data);
  };

  const handleAddPrefect = async () => {
    if (!newPrefectName.trim() || !newPrefectRole.trim()) { alert("Enter name and role."); return; }
    setPrefectsSaving(true);
    const { error } = await supabase.from("prefects").insert({ name: newPrefectName.trim(), role: newPrefectRole.trim() });
    if (error) {
      setPrefects(prev => [...prev, { id: Date.now().toString(), name: newPrefectName.trim(), role: newPrefectRole.trim() }]);
    } else {
      await fetchPrefects();
    }
    setNewPrefectName(""); setNewPrefectRole("");
    setPrefectsSaving(false);
  };

  const handleDeletePrefect = async (id: string) => {
    if (!confirm("Remove this prefect?")) return;
    const { error } = await supabase.from("prefects").delete().eq("id", id);
    if (error) {
      setPrefects(prev => prev.filter(p => p.id !== id));
    } else {
      await fetchPrefects();
    }
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim() || !editingRole.trim()) { alert("Enter name and role."); return; }
    const { error } = await supabase.from("prefects").update({ name: editingName.trim(), role: editingRole.trim() }).eq("id", editingPrefectId);
    if (error) {
      setPrefects(prev => prev.map(p => p.id === editingPrefectId ? { ...p, name: editingName.trim(), role: editingRole.trim() } : p));
    } else {
      await fetchPrefects();
    }
    setEditingPrefectId(null);
  };

  const fetchTeacherLogs = async () => {
    const { data, error } = await supabase
      .from("teacher_logs")
      .select("*")
      .eq("log_date", logDate)
      .order("created_at", { ascending: false });
    if (!error && data) setTeacherLogs(data);
  };

  const handleSubmitLog = async () => {
    if (!timeIn.trim() || !logTopic.trim()) { alert("Enter time in and topic taught."); return; }
    setLogSaving(true);
    const { error } = await supabase.from("teacher_logs").insert({
      teacher_name: lecturer?.name || "Unknown Teacher",
      log_date: logDate,
      time_in: timeIn,
      time_out: timeOut || null,
      class_name: logClass,
      subject: logSubject,
      topic_taught: logTopic,
      notes: logNotes || null,
    });
    if (error) { alert("Failed to save log."); setLogSaving(false); return; }
    setTimeIn(""); setTimeOut(""); setLogTopic(""); setLogNotes("");
    setLogSaving(false);
    fetchTeacherLogs();
    alert("✓ Lesson log saved.");
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm("Delete this log entry?")) return;
    await supabase.from("teacher_logs").delete().eq("id", id);
    fetchTeacherLogs();
  };

  const fetchOccurrences = async () => {
    const { data, error } = await supabase
      .from("daily_occurrence")
      .select("*")
      .order("log_date", { ascending: false })
      .order("time_of_incident", { ascending: false });
    if (!error && data) setOccurrences(data);
  };

  const handleSubmitOccurrence = async () => {
    if (!occTitle.trim() || !occDesc.trim()) { alert("Enter title and description."); return; }
    setOccSaving(true);
    const { error } = await supabase.from("daily_occurrence").insert({
      log_date: occDate,
      tod_name: lecturer.name,
      time_of_incident: occTime || null,
      category: occCategory,
      title: occTitle,
      description: occDesc,
      action_taken: occAction || null,
      students_involved: occStudents || null,
      severity: occSeverity,
    });
    if (error) { alert("Failed to save."); setOccSaving(false); return; }
    setOccTitle(""); setOccDesc(""); setOccAction(""); setOccStudents(""); setOccTime("");
    setOccSaving(false);
    fetchOccurrences();
    alert("✓ Occurrence recorded.");
  };

  const handleDeleteOccurrence = async (id: string) => {
    if (!confirm("Delete this occurrence record?")) return;
    await supabase.from("daily_occurrence").delete().eq("id", id);
    fetchOccurrences();
  };

  const calculateLiveClassCount = (className: string) => {
    let presentCount = 0;
    classStudents[className]?.forEach(student => {
      const record = attRecords[student];
      if (record) {
        if (record.am === 'present') presentCount++;
        if (record.pm === 'present') presentCount++;
      }
    });
    return Math.round(presentCount / 2);
  };

  const calculateLiveClassPct = (className: string) => {
    const totalSlots = (classStudents[className]?.length || 0) * 2;
    if (totalSlots === 0) return 0;
    let presentSlots = 0;
    classStudents[className].forEach(student => {
      const record = attRecords[student];
      if (record) {
        if (record.am === 'present') presentSlots++;
        if (record.pm === 'present') presentSlots++;
      }
    });
    return Math.round((presentSlots / totalSlots) * 100);
  };

  const calculateSchoolWidePresent = () => {
    let grandTotal = 0;
    Object.keys(classStudents).forEach(className => {
      grandTotal += calculateLiveClassCount(className);
    });
    return grandTotal;
  };

  const calculateSchoolWidePct = () => {
    let totalSlots = 0;
    let presentSlots = 0;
    Object.keys(classStudents).forEach(className => {
      totalSlots += classStudents[className].length * 2;
      classStudents[className].forEach(student => {
        const record = attRecords[student];
        if (record) {
          if (record.am === 'present') presentSlots++;
          if (record.pm === 'present') presentSlots++;
        }
      });
    });
    return totalSlots > 0 ? Math.round((presentSlots / totalSlots) * 100) : 0;
  };

  const getClassBreakdownStr = () => {
    const currentStudents = classStudents[selectedClass] || [];
    let p = 0, a = 0, u = 0;
    currentStudents.forEach(student => {
      const record = attRecords[student];
      const r = record && record.class_name === selectedClass
        ? record
        : { am: 'unmarked', pm: 'unmarked' };
      if (r.am === 'present' || r.pm === 'present') p++;
      else if (r.am === 'absent' || r.pm === 'absent') a++;
      else u++;
    });
    return `${p} present, ${a} absent, ${u} not marked`;
  };

  const fetchAttendance = async () => {
    setAttRecords({});
    setIsClassSubmitted(false);
    const { data, error } = await supabase
      .from("student_attendance")
      .select("*")
      .eq("log_date", attDate);

    if (error) {
      console.error(error);
      return;
    }

    const mapped: Record<string, { am: string; pm: string }> = {};
    let submittedMarker = false;

    data?.forEach((row: any) => {
      mapped[row.student_name] = { am: row.am_status, pm: row.pm_status };
      if (row.class_name === selectedClass) {
        if (row.am_status !== 'unmarked' || row.pm_status !== 'unmarked') {
          submittedMarker = true;
        }
      }
    });

    setAttRecords(mapped);
    setIsClassSubmitted(submittedMarker);
  };

  const handleToggleAttendance = (studentName: string, session: "am" | "pm") => {
    if (!canMarkAttendance) return;
    const currentPair = attRecords[studentName] || { am: "unmarked", pm: "unmarked" };
    const currentStatus = currentPair[session];
    
    let nextStatus = "unmarked";
    if (currentStatus === "unmarked") nextStatus = "present";
    else if (currentStatus === "present") nextStatus = "absent";

    setAttRecords(prev => ({
      ...prev,
      [studentName]: { ...currentPair, [session]: nextStatus }
    }));
  };

  const handleMarkAllGroup = (status: 'present' | 'absent') => {
    if (!canMarkAttendance) return;
    const updated = { ...attRecords };
    classStudents[selectedClass].forEach(student => {
      updated[student] = { am: status, pm: status };
    });
    setAttRecords(updated);
  };

  const handleFinalSubmissionLock = async () => {
    if (!canMarkAttendance) return;
    if (!confirm("⚠️ WARNING: Submitting this form secures the roll framework. Changes or corrections are final and cannot be altered. Propose update?")) return;

    const currentStudents = classStudents[selectedClass] || [];
    for (const student of currentStudents) {
      const pair = attRecords[student] || { am: "unmarked", pm: "unmarked" };
      await supabase.from("student_attendance").upsert({
        log_date: attDate,
        class_name: selectedClass,
        student_name: student,
        am_status: pair.am,
        pm_status: pair.pm,
      }, { onConflict: "log_date,student_name" });
    }

    setIsClassSubmitted(true);
    alert("✓ Register securely committed. Corrections lockout algorithm is now active.");
    fetchAttendance();
  };

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
    if (!newSubject.trim() || !newMarks.trim()) { alert("Enter subject and marks."); return; }
    const marks = Number(newMarks);
    const grade = newGrade.trim() || (selectedClass === 'Grade 10' ? getGrade10Grade(marks) : getGrade(marks));
    onUploadResult({ student: selectedStudent, className: selectedClass, subject: newSubject.trim(), marks, grade, term: newTerm });
    setNewMarks(""); setNewGrade("");
  };

  const handleUpdateFees = () => {
    const total = Number(feeTotal);
    const paid = Number(feePaid);
    if (isNaN(total) || isNaN(paid) || total < 0 || paid < 0) { alert("Enter valid fee amounts."); return; }
    if (paid > total) { alert("Amount paid cannot exceed total fees."); return; }
    onUpdateFees(selectedStudent, total, paid);
    alert(`Fees updated for ${selectedStudent}.`);
  };

  const handlePostEvent = async () => {
    if (!evtTitle.trim()) { alert("Enter a title."); return; }
    const { error } = await supabase.from("events").insert({ type: evtType, title: evtTitle, description: evtDesc, date: evtDate });
    if (error) { alert("Failed to post."); return; }
    setEvtTitle(""); setEvtDesc(""); setEvtDate("");
    alert("Posted successfully!");
  };

  const handleDeleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    if (error) { console.error(error); return; }
    setStudents(data || []);
  };

  const fetchStudentDocs = async (studentId: string) => {
    const { data, error } = await supabase.from("student_documents").select("*").eq("student_id", studentId).order("created_at", { ascending: false });
    if (error) { console.error(error); return; }
    setStudentDocs(data || []);
  };

  const handleRegisterStudent = async () => {
    if (!stdName.trim() || !stdAdmNo.trim()) { alert("Enter student name and admission number."); return; }
    setStdRegistering(true);
    const { error } = await supabase.from("students").insert({ name: stdName, class_name: stdClass, admission_no: stdAdmNo, parent_contact: stdParent });
    if (error) { alert("Failed to register student."); setStdRegistering(false); return; }
    alert(`${stdName} registered successfully!`);
    setStdName(""); setStdAdmNo(""); setStdParent("");
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
    const { error: uploadError } = await supabase.storage.from("student-documents").upload(filePath, docFile);
    if (uploadError) { alert("Upload failed."); setDocUploading(false); return; }
    const { data } = supabase.storage.from("student-documents").getPublicUrl(filePath);
    const { error: insertError } = await supabase.from("student_documents").insert({
      student_id: selectedStudentId, document_name: docType, document_type: docType, file_url: data.publicUrl, file_name: docFile.name,
    });
    if (insertError) { alert("Failed to save document."); setDocUploading(false); return; }
    alert("Document uploaded!");
    setDocFile(null); setDocUploading(false);
    fetchStudentDocs(selectedStudentId);
  };

  const handleDeleteDoc = async (id: string) => {
    await supabase.from("student_documents").delete().eq("id", id);
    if (selectedStudentId) fetchStudentDocs(selectedStudentId);
  };

  const handlePostMaterial = async () => {
    if (!matTitle.trim()) { alert("Enter a title."); return; }
    setMatUploading(true);
    let file_url = ""; let file_name = "";
    if (matFile) {
      const filePath = `${Date.now()}_${matFile.name}`;
      const { error: uploadError } = await supabase.storage.from("materials").upload(filePath, matFile);
      if (uploadError) { alert("File upload failed."); setMatUploading(false); return; }
      const { data } = supabase.storage.from("materials").getPublicUrl(filePath);
      file_url = data.publicUrl; file_name = matFile.name;
    }
    onPostMaterial({ title: matTitle, description: matDesc, subject: matSubject, class_name: matClass, teacher_name: lecturer?.name || "Teacher", type: matFile ? "file" : "text", content: matContent, file_url, file_name });
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
    if (!newOpeningDate.trim() || !newClosingDate.trim()) { alert("Please fill out at least Opening and Closing dates."); return; }
    const termData: any = { term: "Term 2, 2026", opening_date: newOpeningDate, idd_date: newIddBreak || "—", midterm_exam: newMidExam || "—", mid_term: newMidBreak || "—", end_term_exam: newEndExam || "—", closing_date: newClosingDate, status: "Current Term" };
    try {
      const { error: deleteError } = await supabase.from("term_dates").delete().neq("term", "xyz_placeholder_safety");
      if (deleteError) { console.error(deleteError); alert("Failed to clear old dates."); return; }
      const { error: insertError } = await supabase.from("term_dates").insert(termData);
      if (insertError) { console.error(insertError); alert("Failed to save term dates."); return; }
      alert("Homepage calendar successfully updated!");
      setNewOpeningDate(""); setNewIddBreak(""); setNewMidExam(""); setNewMidBreak(""); setNewEndExam(""); setNewClosingDate("");
      onUploadTermDate(termData);
    } catch (e) { console.error(e); alert("Something went wrong."); }
  };

  const getMeritList = () => {
    return classStudents[meritClass].map((student) => {
      const r = results.filter((r) => r.student === student && r.term === meritTerm);
      const totalMarks = r.reduce((sum, r) => sum + r.marks, 0);
      const subjects = r.length;
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
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid md:grid-cols-[320px_1fr] gap-4">

        {/* SIDEBAR NAVIGATION SHEET LIST */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Class Lists</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{classNames.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
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

        {/* MAIN PANEL VIEW SECTIONS */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 flex flex-wrap gap-1 h-auto">
                  <TabsTrigger value="results" className="flex-shrink-0 text-xs px-2 py-1.5">Results</TabsTrigger>
                  <TabsTrigger value="attendance" className="flex-shrink-0 text-xs px-2 py-1.5">📅 Attendance</TabsTrigger>
                  <TabsTrigger value="documents" className="flex-shrink-0 text-xs px-2 py-1.5">🔒 Secure Folders</TabsTrigger>
                  <TabsTrigger value="merit" className="flex-shrink-0 text-xs px-2 py-1.5">
                    <Trophy className="h-3 w-3 mr-1" />Merit List
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="flex-shrink-0 text-xs px-2 py-1.5">📚 Materials</TabsTrigger>
                  <TabsTrigger value="timetables" className="flex-shrink-0 text-xs px-2 py-1.5">📅 Timetables</TabsTrigger>
                  {isAdmin && <TabsTrigger value="fees" className="flex-shrink-0 text-xs px-2 py-1.5">Fees</TabsTrigger>}
                  {isAdmin && <TabsTrigger value="events" className="flex-shrink-0 text-xs px-2 py-1.5">📣 Events</TabsTrigger>}
                  {isAdmin && <TabsTrigger value="students" className="flex-shrink-0 text-xs px-2 py-1.5">🎓 Students</TabsTrigger>}
                  <TabsTrigger value="prefects" className="flex-shrink-0 text-xs px-2 py-1.5">🏅 Prefects</TabsTrigger>
                  <TabsTrigger value="mylog" className="flex-shrink-0 text-xs px-2 py-1.5">📋 My Log</TabsTrigger>
                  <TabsTrigger value="occurrence" className="flex-shrink-0 text-xs px-2 py-1.5">📖 Occurrence</TabsTrigger>
                </TabsList>

                {/* SECURE SYSTEM DOCUMENT FOLDER WRAPPER */}
                <TabsContent value="documents" className="space-y-6">
                  <ProtectedDocumentManager
                    studentId={selectedStudent} 
                    studentName={selectedStudent} 
                    currentUserRole={isAdmin ? "principal" : "teacher"} 
                    currentUserId={lecturer?.id || "staff_user"} 
                  />
                </TabsContent>

                {/* ATTENDANCE TAB PANEL */}
                <TabsContent value="attendance" className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-emerald-800">Target Date:</span>
                      <input 
                        type="date" 
                        value={attDate} 
                        onChange={(e) => setAttDate(e.target.value)} 
                        className="border border-emerald-200 rounded-md px-3 py-1.5 text-sm bg-slate-50 font-mono text-[#1A2E1E] focus:outline-none focus:border-[#006B3C]" 
                      />
                    </div>

                    <div className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-mono tracking-wide px-3 py-1.5 rounded-full border font-semibold",
                      canMarkAttendance 
                        ? "bg-[#E8F5EE] border-emerald-300 text-[#006B3C]" 
                        : "bg-[#FDF6E3] border-amber-300 text-[#C8992A]"
                    )}>
                      {canMarkAttendance ? "✏️ Editing Enabled" : "🔒 View Only"}
                    </div>

                    <div className="sm:ml-auto flex flex-wrap gap-2">
                      {canMarkAttendance && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleMarkAllGroup('present')} className="border-emerald-200 hover:bg-emerald-50 text-emerald-800 font-medium">✓ All Present</Button>
                          <Button variant="outline" size="sm" onClick={() => handleMarkAllGroup('absent')} className="border-rose-200 hover:bg-rose-50 text-rose-800 font-medium">✗ All Absent</Button>
                          <Button size="sm" onClick={handleFinalSubmissionLock} className="bg-[#C8992A] hover:bg-[#b8891f] text-white font-medium flex items-center gap-1">💾 Save</Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm">
                      <div className="text-[10px] font-mono tracking-wider text-emerald-600 uppercase font-bold mb-2">Form 3</div>
                      <div className="font-serif text-3xl font-bold text-[#006B3C] flex items-baseline">
                        {calculateLiveClassCount("Form 3")}
                      </div>
                    </div>
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
      <Card className="w-full mt-2 border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center p-6 text-destructive font-medium">
          <Lock className="w-5 h-5 mr-2" />
          You do not have permission to view or manage documents for this student. Only the Principal has access.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-2">
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
