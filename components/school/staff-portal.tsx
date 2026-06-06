"use client";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Trophy, Calendar, FileText, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
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

// Strict school registration master teacher assignment data map
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
  
  // Crash protection logic for admin profiles without standard teaching lines
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

  // DYNAMIC TRACKING STATE PARAMETERS
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
  const [logTeacherFilter, setLogTeacherFilter] = useState("all");
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
  const [occViewDate, setOccViewDate] = useState(SYSTEM_TODAY);
  const [occTeacherFilter, setOccTeacherFilter] = useState("");
  const [studentFolders, setStudentFolders] = useState<Record<string, any[]>>({});
  const [openFolderStudent, setOpenFolderStudent] = useState<string | null>(null);
  const [folderDocType, setFolderDocType] = useState("Birth Certificate");
  const [folderDocFile, setFolderDocFile] = useState<File | null>(null);
  const [folderUploading, setFolderUploading] = useState(false);
  const [folderDocs, setFolderDocs] = useState<any[]>([]);

  // Auto-fetch hook dependencies map
  useEffect(() => {
    if (activeTab === "students") fetchStudents();
    if (activeTab === "attendance") fetchAttendance();
    if (activeTab === "prefects") fetchPrefects();
    if (activeTab === "occurrence") fetchOccurrences();
  }, [activeTab, selectedClass, attDate]);

  // Dedicated effect listener monitoring date changes for teacher logs
  useEffect(() => {
    if (activeTab === "mylog") fetchTeacherLogs();
  }, [activeTab, logDate]);
  useEffect(() => {
  if (activeTab === "occurrence") fetchOccurrences(occTeacherFilter, occViewDate);
}, [occViewDate, occTeacherFilter, activeTab]);

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

  // PREFECTS STATE & HANDLERS
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

  // FETCH DIAL FILTERED STATED LOG ENTRIES (FIXED FOR TARGETED DATE CAPTURE ONLY)
  const fetchTeacherLogs = async () => {
    const { data, error } = await supabase
      .from("teacher_logs")
      .select("*")
      .eq("log_date", logDate) // Strict day isolation query parameter rule
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
  const fetchOccurrences = async (teacherFilter = occTeacherFilter, viewDate = occViewDate) => {
  let query = supabase
    .from("daily_occurrence")
    .select("*")
    .order("log_date", { ascending: false })
    .order("time_of_incident", { ascending: false });

  if (!teacherFilter) {
    query = query.eq("log_date", viewDate);
  } else if (viewDate !== SYSTEM_TODAY) {
    query = query.eq("log_date", viewDate);
  }

  const { data, error } = await query;
  if (!error && data) setOccurrences(data);
};

  // Apply date filter only when no teacher is selected,
  // OR when both teacher and a non-today date are selected
  if (!occTeacherFilter) {
    query = query.eq("log_date", occViewDate);
  } else if (occViewDate !== SYSTEM_TODAY) {
    query = query.eq("log_date", occViewDate);
  }

  const { data, error } = await query;
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

  // STATISTICAL METRIC CALCULATORS
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
    // Count by student, not by session
    if (r.am === 'present' || r.pm === 'present') p++;
    else if (r.am === 'absent' || r.pm === 'absent') a++;
    else u++;
  });
  return `${p} present, ${a} absent, ${u} not marked`;
};
 const fetchAttendance = async () => {
  setAttRecords({});
  setIsClassSubmitted(false);

  // Fetch ALL classes at once so summary cards are accurate
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
    // Only check submission status for the currently selected class
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
  const fetchStudentFolderDocs = async (studentName: string) => {
  const { data, error } = await supabase
    .from("student_documents")
    .select("*")
    .eq("student_name", studentName)
    .order("created_at", { ascending: false });
  if (!error && data) setFolderDocs(data);
};

const handleFolderUpload = async (studentName: string) => {
  if (!folderDocFile) { alert("Select a file."); return; }
  setFolderUploading(true);
  const filePath = `folders/${studentName.replace(/ /g, "_")}/${Date.now()}_${folderDocFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("student-documents")
    .upload(filePath, folderDocFile);
  if (uploadError) { alert("Upload failed."); setFolderUploading(false); return; }
  const { data } = supabase.storage.from("student-documents").getPublicUrl(filePath);
  const { error: insertError } = await supabase.from("student_documents").insert({
    student_name: studentName,
    document_name: folderDocType,
    document_type: folderDocType,
    file_url: data.publicUrl,
    file_name: folderDocFile.name,
  });
  if (insertError) { alert("Failed to save."); setFolderUploading(false); return; }
  alert("✓ Document uploaded!");
  setFolderDocFile(null);
  setFolderUploading(false);
  fetchStudentFolderDocs(studentName);
};

const handleDeleteFolderDoc = async (id: string, studentName: string) => {
  if (!confirm("Delete this document?")) return;
  await supabase.from("student_documents").delete().eq("id", id);
  fetchStudentFolderDocs(studentName);
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
                  <TabsTrigger value="merit" className="flex-shrink-0 text-xs px-2 py-1.5">
                    <Trophy className="h-3 w-3 mr-1" />Merit List
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="flex-shrink-0 text-xs px-2 py-1.5">📚 Materials</TabsTrigger>
                  <TabsTrigger value="timetables" className="flex-shrink-0 text-xs px-2 py-1.5">📅 Timetables</TabsTrigger>
                  {isAdmin && <TabsTrigger value="fees" className="flex-shrink-0 text-xs px-2 py-1.5">Fees</TabsTrigger>}
                  {isAdmin && <TabsTrigger value="events" className="flex-shrink-0 text-xs px-2 py-1.5">📣 Events</TabsTrigger>}
                  {isAdmin && <TabsTrigger value="students" className="flex-shrink-0 text-xs px-2 py-1.5">🎓 Students</TabsTrigger>}
                  {isAdmin && <TabsTrigger value="folders" className="flex-shrink-0 text-xs px-2 py-1.5">📁 Folders</TabsTrigger>}
                  <TabsTrigger value="prefects" className="flex-shrink-0 text-xs px-2 py-1.5">🏅 Prefects</TabsTrigger>
                  <TabsTrigger value="mylog" className="flex-shrink-0 text-xs px-2 py-1.5">📋 My Log</TabsTrigger>
                  <TabsTrigger value="occurrence" className="flex-shrink-0 text-xs px-2 py-1.5">📖 Occurrence</TabsTrigger>
                </TabsList>

                {/* ATTENDANCE TAB PANEL */}
                <TabsContent value="attendance" className="space-y-6">
                  
                  {/* TOP CONTROL HUB */}
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

                  {/* SUMMARY CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm">
                      <div className="text-[10px] font-mono tracking-wider text-emerald-600 uppercase font-bold mb-2">Form 3</div>
                      <div className="font-serif text-3xl font-bold text-[#006B3C] flex items-baseline">
                        {calculateLiveClassCount("Form 3")}
                        <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ {classStudents["Form 3"].length}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">8-4-4 · {calculateLiveClassPct("Form 3")}% today</div>
                    </div>

                    <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm">
                      <div className="text-[10px] font-mono tracking-wider text-emerald-600 uppercase font-bold mb-2">Form 4</div>
                      <div className="font-serif text-3xl font-bold text-[#006B3C] flex items-baseline">
                        {calculateLiveClassCount("Form 4")}
                        <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ {classStudents["Form 4"].length}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">8-4-4 · {calculateLiveClassPct("Form 4")}% today</div>
                    </div>

                    <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm">
                      <div className="text-[10px] font-mono tracking-wider text-emerald-600 uppercase font-bold mb-2">Grade 10</div>
                      <div className="font-serif text-3xl font-bold text-[#006B3C] flex items-baseline">
                        {calculateLiveClassCount("Grade 10")}
                        <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ {classStudents["Grade 10"].length}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">CBC · {calculateLiveClassPct("Grade 10")}% today</div>
                    </div>

                    <div className="bg-[#FDF6E3] border border-[#C8992A]/30 rounded-xl p-5 shadow-sm">
                      <div className="text-[10px] font-mono tracking-wider text-[#A0751A] uppercase font-bold mb-2">School-Wide Rate</div>
                      <div className="font-serif text-3xl font-bold text-[#C8992A]">{calculateSchoolWidePct()}%</div>
                      <div className="text-[10px] text-[#A0751A] mt-1 font-mono uppercase font-bold">
                        {new Date(attDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()} · {calculateSchoolWidePresent()} of {Object.values(classStudents).flat().length} present
                      </div>
                    </div>
                  </div>

                  {/* STAGE HEADER BLOCK DISPLAY */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h2 className="font-serif text-2xl font-bold text-[#006B3C]">{selectedClass}</h2>
                      
                    </div>

                    {!canMarkAttendance && (
                      <div className="p-3 rounded-lg bg-[#FDF6E3] border border-amber-300 text-[#A0751A] text-xs font-medium">
                        {lockBannerMessage}
                      </div>
                    )}
                    
                    <div className="inline-flex items-center gap-1 bg-[#E8F5EE] border border-emerald-200 text-[#006B3C] font-mono text-xs px-3 py-1 rounded-full font-semibold">
                      👤 {CLASS_TEACHERS[selectedClass] === 'dennis' ? 'Mr. Dennis Kipkoech' : CLASS_TEACHERS[selectedClass] === 'guyo' ? 'Mr. Guyo Halake' : 'Madam Selina Ewoi'}
                    </div>
                  </div>

                  {/* DATA GRID */}
                  <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="w-[60px]">#</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead className="text-center w-[160px]">Morning (AM)</TableHead>
                          <TableHead className="text-center w-[160px]">Afternoon (PM)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(classStudents[selectedClass] || []).map((studentName, idx) => {
                          const pair = attRecords[studentName] || { am: "unmarked", pm: "unmarked" };
                          
                          return (
                            <TableRow key={studentName} className="hover:bg-slate-50/50">
                              <TableCell className="font-mono text-xs text-muted-foreground">{idx + 1}</TableCell>
                              <TableCell className="font-medium text-slate-700">{studentName}</TableCell>
                              
                              <TableCell className="text-center">
                                <Button size="sm" variant="ghost" 
                                  onClick={() => handleToggleAttendance(studentName, "am")}
                                  disabled={!canMarkAttendance}
                                  className={cn("w-28 gap-1.5 text-xs font-mono tracking-wider border transition-all font-bold", 
                                    pair.am === 'present' && "bg-[#E8F5EE] text-[#006B3C] border-emerald-200 hover:bg-emerald-100",
                                    pair.am === 'absent' && "bg-[#FDECEA] text-[#C0392B] border-rose-200 hover:bg-rose-100",
                                    pair.am === 'unmarked' && "text-slate-400 border-dashed border-slate-200 hover:bg-slate-50"
                                  )}>
                                  {pair.am === 'present' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                  {pair.am === 'absent' && <XCircle className="h-3.5 w-3.5" />}
                                  {pair.am === 'unmarked' && <HelpCircle className="h-3.5 w-3.5" />}
                                  {pair.am.toUpperCase()}
                                </Button>
                              </TableCell>

                              <TableCell className="text-center">
                                <Button size="sm" variant="ghost" 
                                  onClick={() => handleToggleAttendance(studentName, "pm")}
                                  disabled={!canMarkAttendance}
                                  className={cn("w-28 gap-1.5 text-xs font-mono tracking-wider border transition-all font-bold", 
                                    pair.pm === 'present' && "bg-[#E8F5EE] text-[#006B3C] border-emerald-200 hover:bg-emerald-100",
                                    pair.pm === 'absent' && "bg-[#FDECEA] text-[#C0392B] border-rose-200 hover:bg-rose-100",
                                    pair.pm === 'unmarked' && "text-slate-400 border-dashed border-slate-200 hover:bg-slate-50"
                                  )}>
                                  {pair.pm === 'present' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                  {pair.pm === 'absent' && <XCircle className="h-3.5 w-3.5" />}
                                  {pair.pm === 'unmarked' && <HelpCircle className="h-3.5 w-3.5" />}
                                  {pair.pm.toUpperCase()}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* RESULTS TAB */}
                <TabsContent value="results" className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">Selected: <span className="font-medium text-foreground">{selectedStudent}</span> - {selectedClass}</p>
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
                                <TableHead>Subject</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead><TableHead className="w-[80px]"></TableHead>
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
                </TabsContent>

                {/* MERIT LIST TAB */}
                <TabsContent value="merit" className="space-y-4">
                  <h4 className="font-medium text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" />Class Merit List</h4>
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
                  {materials.filter((m) => m.teacher_name === lecturer?.name).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No materials posted yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {materials.filter((m) => m.teacher_name === lecturer?.name).map((m) => (
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
                  {isAdmin && (
                    <div className="space-y-3 border rounded-md p-4 bg-muted/30">
                      <h4 className="font-medium text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-600" />Upload New Timetable</h4>
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
                            <p className="font-semibold text-slate-900">{t.title}</p>
                            <p className="text-xs text-muted-foreground">{t.term} · {new Date(t.created_at).toLocaleDateString()}</p>
                          </div>
                          {isAdmin && (
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
                            <p className="font-semibold text-slate-900">{t.title}</p>
                            <p className="text-xs text-muted-foreground">{t.term} · {new Date(t.created_at).toLocaleDateString()}</p>
                          </div>
                          {isAdmin && (
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
                  {isAdmin && (
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
                {isAdmin && (
                  <TabsContent value="fees" className="space-y-4">
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
                  </TabsContent>
                )}

                {/* EVENTS TAB */}
                {isAdmin && (
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

                {/* STUDENTS TAB */}
                {isAdmin && (
                  <TabsContent value="students" className="space-y-6">
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
                        <Plus className="h-4 w-4 mr-2" /> Register Student
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-slate-800 border-b pb-1">Registered Students</h4>
                      <Button onClick={fetchStudents} variant="outline" className="text-xs">🔄 Refresh List</Button>
                      {students.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No students registered yet. Click Refresh.</p>
                      ) : (
                        <div className="space-y-3">
                          {students.map((s) => (
                            <div key={s.id}
                              className={`border rounded-lg p-4 bg-white shadow-sm space-y-3 cursor-pointer transition-colors ${selectedStudentId === s.id ? "border-blue-500 bg-blue-50" : "hover:bg-slate-50"}`}
                              onClick={() => { setSelectedStudentId(s.id); fetchStudentDocs(s.id); }}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-slate-900">{s.name}</p>
                                  <p className="text-xs text-muted-foreground">Adm: {s.admission_no} · {s.class_name} · 📞 {s.parent_contact || "N/A"}</p>
                                </div>
                                <Button variant="outline" size="sm"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteStudent(s.id); }}
                                  className="text-destructive border-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              {selectedStudentId === s.id && (
                                <div className="space-y-3 border-t pt-3">
                                  <h5 className="text-xs font-semibold text-slate-700">📎 Documents</h5>
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
                {isAdmin && (
  <TabsContent value="folders" className="space-y-4">
    <div className="flex items-center justify-between">
      <h4 className="font-semibold text-sm text-slate-800">📁 Student Document Folders</h4>
      <span className="text-xs text-muted-foreground">{Object.values(classStudents).flat().length} students</span>
    </div>

    {/* Class Filter */}
    <select
      value={selectedClass}
      onChange={(e) => setSelectedClass(e.target.value)}
      className="w-full border rounded-md px-3 py-2 text-sm bg-white"
    >
      {classNames.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>

    {/* Student Folder List */}
    <div className="space-y-2">
      {classStudents[selectedClass].map((studentName) => (
        <div key={studentName} className="border rounded-lg bg-white shadow-sm overflow-hidden">
          {/* Folder Header */}
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50"
            onClick={() => {
              if (openFolderStudent === studentName) {
                setOpenFolderStudent(null);
                setFolderDocs([]);
              } else {
                setOpenFolderStudent(studentName);
                setFolderDocFile(null);
                fetchStudentFolderDocs(studentName);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">📁</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{studentName}</p>
                <p className="text-xs text-muted-foreground">{selectedClass}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {openFolderStudent === studentName ? "▲ Close" : "▼ Open"}
            </span>
          </div>

          {/* Folder Content */}
          {openFolderStudent === studentName && (
            <div className="border-t p-4 space-y-3 bg-slate-50">
              {/* Upload Form */}
              <div className="space-y-2 bg-white border rounded-md p-3">
                <p className="text-xs font-semibold text-blue-900">📎 Upload Document</p>
                <select
                  value={folderDocType}
                  onChange={(e) => setFolderDocType(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option>Birth Certificate</option>
                  <option>JSS Result Slip</option>
                  <option>Transfer Letter</option>
                  <option>Medical Certificate</option>
                  <option>Parent ID Copy</option>
                  <option>Fee Receipt</option>
                  <option>Report Form</option>
                  <option>Other</option>
                </select>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setFolderDocFile(e.target.files?.[0] || null)}
                  className="text-sm w-full"
                />
                {folderDocFile && (
                  <p className="text-xs text-green-600">Selected: {folderDocFile.name}</p>
                )}
                <Button
                  onClick={() => handleFolderUpload(studentName)}
                  disabled={folderUploading}
                  className="bg-[#1a56a0] hover:bg-[#154a8a] w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {folderUploading ? "Uploading..." : "Upload Document"}
                </Button>
              </div>

              {/* Documents List */}
              {folderDocs.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-2">
                  No documents uploaded yet.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600">{folderDocs.length} document{folderDocs.length !== 1 ? "s" : ""}</p>
                  {folderDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between bg-white border rounded-md px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{doc.document_name}</p>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 underline"
                        >
                          📄 {doc.file_name}
                        </a>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFolderDoc(doc.id, studentName)}
                        className="text-destructive border-destructive hover:bg-destructive/10"
                      >
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
  </TabsContent>
)}
                
                {/* PREFECTS COUNCIL MODULE */}
                <TabsContent value="prefects" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-blue-900">🏅 Wamy High Prefects 2025 → 2026</h4>
                    <span className="text-xs text-muted-foreground">{prefects.length} prefects</span>
                  </div>

                  {isAdmin && ( 
                    <div className="border rounded-md p-4 bg-muted/30 space-y-3">
                      <h5 className="text-xs font-semibold text-blue-900">➕ Add New Prefect</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs font-semibold">Student Name</Label>
                          <input
                            placeholder="e.g. Ahmed Noor"
                            value={newPrefectName}
                            onChange={(e) => setNewPrefectName(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold">Role / Position</Label>
                          <input
                            placeholder="e.g. Library Captain"
                            value={newPrefectRole}
                            onChange={(e) => setNewPrefectRole(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleAddPrefect}
                        disabled={prefectsSaving}
                        className="bg-[#1a56a0] hover:bg-[#154a8a] w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {prefectsSaving ? "Saving..." : "Add Prefect"}
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    {prefects.map((p, i) => (
                      <div key={p.id} className="border rounded-md bg-white shadow-sm overflow-hidden">
                        {editingPrefectId === p.id && isAdmin ? (
                          <div className="p-3 space-y-2 bg-blue-50">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Name"
                              />
                              <input
                                value={editingRole}
                                onChange={(e) => setEditingRole(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Role"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveEdit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                ✓ Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingPrefectId(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full min-w-[32px] text-center">
                                #{i + 1}
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.role}</p>
                              </div>
                            </div>
                            {isAdmin && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => { setEditingPrefectId(p.id); setEditingName(p.name); setEditingRole(p.role); }}
                                  className="text-xs"
                                >
                                  ✏️ Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeletePrefect(p.id)}
                                  className="text-destructive border-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* LESSON LESSON LOG COMPONENT (DYNAMIC DATE ISOLATION ACTIVE) */}
                <TabsContent value="mylog" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-slate-800">📋 My Lesson Log</h4>
                    <span className="text-xs text-muted-foreground">{lecturer?.name || "Teacher Profile"}</span>
                  </div>

                  {/* LOG ENTRY FORM */}
                  <div className="border rounded-md p-4 bg-muted/30 space-y-3">
                    <h5 className="text-xs font-semibold text-blue-900">➕ Record Today's Entry</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs font-semibold">Date</Label>
                        <input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Class</Label>
                        <select value={logClass} onChange={(e) => setLogClass(e.target.value)}
                          className="w-full border rounded-md px-3 py-2 text-sm bg-white h-10">
                          {classNames.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs font-semibold">Time In</Label>
                        <input type="time" value={timeIn} onChange={(e) => setTimeIn(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Time Out</Label>
                        <input type="time" value={timeOut} onChange={(e) => setTimeOut(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Subject</Label>
                      <select value={logSubject} onChange={(e) => setLogSubject(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white h-10">
                        {lecturerSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Topic Taught</Label>
                      <input placeholder="e.g. Quadratic Equations" value={logTopic} onChange={(e) => setLogTopic(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Notes (optional)</Label>
                      <textarea placeholder="e.g. Students struggled with factorisation..." value={logNotes} onChange={(e) => setLogNotes(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm min-h-[70px] bg-white" />
                    </div>
                    <Button onClick={handleSubmitLog} disabled={logSaving} className="bg-[#1a56a0] hover:bg-[#154a8a] w-full">
                      <Plus className="h-4 w-4 mr-2" />{logSaving ? "Saving..." : "Save Log Entry"}
                    </Button>
                  </div>

                  {/* ADMIN VIEW — See all teachers matching selected logDate */}
                  {isAdmin && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap border-b pb-2">
  <h5 className="text-xs font-semibold text-slate-700">All Teacher Logs ({logDate})</h5>
  <select
    value={logTeacherFilter}
    onChange={(e) => setLogTeacherFilter(e.target.value)}
    className="border rounded-md px-2 py-1 text-xs bg-white ml-auto"
  >
    <option value="all">All Teachers</option>
    {[...new Set(teacherLogs.map(l => l.teacher_name))].sort().map(name => (
      <option key={name} value={name}>{name}</option>
    ))}
  </select>
</div>
                      {teacherLogs.filter(l => logTeacherFilter === "all" ? true : l.teacher_name === logTeacherFilter).length === 0 ? (
  <p className="text-xs text-muted-foreground italic p-3 text-center border border-dashed rounded-md bg-white">
    No logs recorded on this date.
  </p>
                      ) : (
                        <div className="space-y-2">
                          {teacherLogs.filter(l => logTeacherFilter === "all" ? true : l.teacher_name === logTeacherFilter).map((log) => (
                            <div key={log.id} className="border rounded-md bg-white p-3 shadow-sm space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-800">{log.teacher_name}</span>
                                  <span className="text-xs text-muted-foreground">·</span>
                                  <span className="text-xs text-muted-foreground font-mono">{log.log_date}</span>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteLog(log.id)}
                                  className="text-destructive border-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                                  {log.class_name}
                                </span>
                                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                                  {log.subject}
                                </span>
                                <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-mono text-[11px]">
                                  ⏰ {log.time_in}{log.time_out ? ` → ${log.time_out}` : ""}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-slate-800 pt-0.5">{log.topic_taught}</p>
                              {log.notes && <p className="text-xs text-muted-foreground bg-slate-50 p-2 rounded border border-slate-100 italic">{log.notes}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TEACHER VIEW — See only own logs matching selected logDate */}
                  {!isAdmin && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-slate-700 border-b pb-1">My Recent Logs ({logDate})</h5>
                      {teacherLogs.filter(l => l.teacher_name === lecturer?.name).length === 0 ? (
                        <p className="text-xs text-muted-foreground italic p-3 text-center border border-dashed rounded-md bg-white">
                          You haven't recorded any entries on this date.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {teacherLogs.filter(l => l.teacher_name === lecturer?.name).map((log) => (
                            <div key={log.id} className="border rounded-md bg-white p-3 shadow-sm space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-mono">{log.log_date}</span>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteLog(log.id)}
                                  className="text-destructive border-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                                  {log.class_name}
                                </span>
                                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                                  {log.subject}
                                </span>
                                <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-mono text-[11px]">
                                  ⏰ {log.time_in}{log.time_out ? ` → ${log.time_out}` : ""}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-slate-800 pt-0.5">{log.topic_taught}</p>
                              {log.notes && <p className="text-xs text-muted-foreground bg-slate-50 p-2 rounded border border-slate-100 italic">{log.notes}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="occurrence" className="space-y-4">

  {/* HEADER */}
  <div className="flex items-center justify-between">
    <div>
      <h4 className="font-semibold text-sm text-slate-800">📖 Daily Occurrence Book</h4>
      <p className="text-xs text-muted-foreground mt-0.5">Teacher on Duty (T.O.D) log</p>
    </div>
    <div className="text-right">
      <p className="text-xs font-semibold text-slate-700">{lecturer.name}</p>
      <p className="text-xs text-muted-foreground">T.O.D</p>
    </div>
  </div>

  {/* ENTRY FORM */}
  <div className="border rounded-md p-4 bg-muted/30 space-y-3">
    <h5 className="text-xs font-semibold text-blue-900">➕ Record New Occurrence</h5>

    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="text-xs font-semibold">Date</Label>
        <input type="date" value={occDate} onChange={(e) => setOccDate(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div>
        <Label className="text-xs font-semibold">Time of Incident</Label>
        <input type="time" value={occTime} onChange={(e) => setOccTime(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="text-xs font-semibold">Category</Label>
        <select value={occCategory} onChange={(e) => setOccCategory(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm bg-white h-10">
          <option value="discipline">⚠️ Discipline</option>
          <option value="academic">📚 Academic</option>
          <option value="health">🏥 Health / Medical</option>
          <option value="security">🔒 Security</option>
          <option value="property">🏫 School Property</option>
          <option value="visitor">👤 Visitor</option>
          <option value="general">📝 General</option>
        </select>
      </div>
      <div>
        <Label className="text-xs font-semibold">Severity</Label>
        <select value={occSeverity} onChange={(e) => setOccSeverity(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm bg-white h-10">
          <option value="normal">🟢 Normal</option>
          <option value="moderate">🟡 Moderate</option>
          <option value="serious">🔴 Serious</option>
        </select>
      </div>
    </div>

    <div>
      <Label className="text-xs font-semibold">Title / Heading</Label>
      <input placeholder="e.g. Student found outside class during lesson"
        value={occTitle} onChange={(e) => setOccTitle(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
    </div>

    <div>
      <Label className="text-xs font-semibold">Description</Label>
      <textarea placeholder="Describe what happened in detail..."
        value={occDesc} onChange={(e) => setOccDesc(e.target.value)}
        className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px] bg-white" />
    </div>

    <div>
      <Label className="text-xs font-semibold">Students Involved (optional)</Label>
      <input placeholder="e.g. Bagayo Khalil, Casim Lope"
        value={occStudents} onChange={(e) => setOccStudents(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
    </div>

    <div>
      <Label className="text-xs font-semibold">Action Taken (optional)</Label>
      <textarea placeholder="e.g. Reported to class teacher, sent to principal..."
        value={occAction} onChange={(e) => setOccAction(e.target.value)}
        className="w-full border rounded-md px-3 py-2 text-sm min-h-[60px] bg-white" />
    </div>

    <Button onClick={handleSubmitOccurrence} disabled={occSaving}
      className="bg-[#1a56a0] hover:bg-[#154a8a] w-full">
      <Plus className="h-4 w-4 mr-2" />{occSaving ? "Saving..." : "Record Occurrence"}
    </Button>
  </div>

  {/* FILTER & LIST */}
  <div className="space-y-3">
    <div className="flex items-center gap-2 flex-wrap">
  <h5 className="text-xs font-semibold text-slate-700">
    {isAdmin ? "All Occurrences" : "My Recorded Occurrences"}
  </h5>
  <div className="flex items-center gap-2 ml-auto flex-wrap">
  <input
    type="date"
    value={occViewDate}
    max={SYSTEM_TODAY}
    onChange={(e) => { setOccViewDate(e.target.value); setOccTeacherFilter(""); }}
    className="border border-slate-200 rounded-md px-2 py-1 text-xs bg-white font-mono text-slate-700 focus:outline-none focus:border-blue-400"
  />
  {isAdmin && (
    <select
      value={occTeacherFilter}
      onChange={(e) => setOccTeacherFilter(e.target.value)}
      className="border rounded-md px-2 py-1 text-xs bg-white"
    >
      <option value="" disabled>-- Select Teacher --</option>
      <option value="Mr. Guyo Halake">Mr. Guyo Halake</option>
      <option value="Mr. Dennis Kipkoech">Mr. Dennis Kipkoech</option>
      <option value="Mr. John Simiyu">Mr. John Simiyu</option>
      <option value="Mrs. Selina Ewoi">Mrs. Selina Ewoi</option>
      <option value="Mr. Leonard Kiprotich">Mr. Leonard Kiprotich</option>
      <option value="Mr. Rotich Mark">Mr. Rotich Mark</option>
      <option value="Mr. Kibet Shadrack">Mr. Kibet Shadrack</option>
    </select>
  )}
</div>
  <select value={occFilter} onChange={(e) => setOccFilter(e.target.value)}
    className="border rounded-md px-2 py-1 text-xs bg-white">
        <option value="all">All Categories</option>
        <option value="discipline">Discipline</option>
        <option value="academic">Academic</option>
        <option value="health">Health</option>
        <option value="security">Security</option>
        <option value="property">School Property</option>
        <option value="visitor">Visitor</option>
        <option value="general">General</option>
      </select>
    </div>

    {(() => {
     const filtered = occurrences
  .filter(o => isAdmin ? (occTeacherFilter ? o.tod_name === occTeacherFilter : true) : o.tod_name === lecturer.name)
  .filter(o => occFilter === "all" ? true : o.category === occFilter);
      if (filtered.length === 0) return (
        <p className="text-xs text-muted-foreground italic">No occurrences recorded yet.</p>
      );

      // group by date
      const grouped = filtered.reduce((acc, o) => {
        if (!acc[o.log_date]) acc[o.log_date] = [];
        acc[o.log_date].push(o);
        return acc;
      }, {} as Record<string, any[]>);

      const severityColor = (s: string) =>
        s === "serious" ? "bg-red-50 border-red-200" :
        s === "moderate" ? "bg-yellow-50 border-yellow-200" :
        "bg-white border-slate-200";

      const severityBadge = (s: string) =>
        s === "serious" ? "bg-red-100 text-red-700 border-red-200" :
        s === "moderate" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
        "bg-green-100 text-green-700 border-green-200";

      const categoryIcon: Record<string, string> = {
        discipline: "⚠️", academic: "📚", health: "🏥",
        security: "🔒", property: "🏫", visitor: "👤", general: "📝"
      };

      const allEntries = Object.values(grouped).flat();

      return (
        <div className="space-y-4">
          {occTeacherFilter ? (
            Object.entries(grouped).map(([date, entries]) => (
              <div key={date} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{date}</div>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400">{entries.length} entr{entries.length === 1 ? "y" : "ies"}</span>
                </div>
                {entries.map((o) => (
                  <div key={o.id} className={`border rounded-lg p-4 shadow-sm space-y-2 ${severityColor(o.severity)}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base">{categoryIcon[o.category] || "📝"}</span>
                        <span className="text-sm font-semibold text-slate-800">{o.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${severityBadge(o.severity)}`}>
                          {o.severity}
                        </span>
                      </div>
                      {(isAdmin || o.tod_name === lecturer.name) && (
                        <Button size="sm" variant="outline" onClick={() => handleDeleteOccurrence(o.id)}
                          className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                        👤 {o.tod_name}
                      </span>
                      {o.time_of_incident && (
                        <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                          ⏰ {o.time_of_incident}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700">{o.description}</p>
                    {o.students_involved && (
                      <div className="text-xs bg-white border border-slate-200 rounded-md px-3 py-2">
                        <span className="font-semibold text-slate-600">Students involved: </span>
                        <span className="text-slate-700">{o.students_involved}</span>
                      </div>
                    )}
                    {o.action_taken && (
                      <div className="text-xs bg-white border border-slate-200 rounded-md px-3 py-2">
                        <span className="font-semibold text-slate-600">Action taken: </span>
                        <span className="text-slate-700">{o.action_taken}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {occViewDate === SYSTEM_TODAY ? "Today" : occViewDate}
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">{allEntries.length} entr{allEntries.length === 1 ? "y" : "ies"}</span>
              </div>
              {allEntries.map((o) => (
                <div key={o.id} className={`border rounded-lg p-4 shadow-sm space-y-2 ${severityColor(o.severity)}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">{categoryIcon[o.category] || "📝"}</span>
                      <span className="text-sm font-semibold text-slate-800">{o.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${severityBadge(o.severity)}`}>
                        {o.severity}
                      </span>
                    </div>
                    {(isAdmin || o.tod_name === lecturer.name) && (
                      <Button size="sm" variant="outline" onClick={() => handleDeleteOccurrence(o.id)}
                        className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                      👤 {o.tod_name}
                    </span>
                    {o.time_of_incident && (
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                        ⏰ {o.time_of_incident}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700">{o.description}</p>
                  {o.students_involved && (
                    <div className="text-xs bg-white border border-slate-200 rounded-md px-3 py-2">
                      <span className="font-semibold text-slate-600">Students involved: </span>
                      <span className="text-slate-700">{o.students_involved}</span>
                    </div>
                  )}
                  {o.action_taken && (
                    <div className="text-xs bg-white border border-slate-200 rounded-md px-3 py-2">
                      <span className="font-semibold text-slate-600">Action taken: </span>
                      <span className="text-slate-700">{o.action_taken}</span>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      );
    })()}
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
