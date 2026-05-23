"use client";

const getKiswahiliComment = (marks: number): string => {
  if (marks >= 75) return "Mwanafunzi amefanya vizuri sana. Endelea hivyo.";
  if (marks >= 60) return "Kazi nzuri. Jitahidi zaidi.";
  if (marks >= 45) return "Wastani. Jitahidi zaidi ili kuboresha.";
  if (marks >= 30) return "Unahitaji kujitahidi zaidi.";
  return "Matokeo mabaya sana. Tafadhali jitahidi sana.";
};

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText } from "lucide-react";
import { useState } from "react";
import {
  studentAccounts,
  getStudentClass,
  Result,
  FeeRecord,
  termOptions,
  getGrade,
  getGrade10Grade,
  getComment,
  classStudents,
} from "@/lib/school-data";

interface StudentPortalProps {
  studentName: string;
  results: Result[];
  fees: Record<string, FeeRecord>;
  materials: any[];
  timetables: any[];
}

export function StudentPortal({ studentName, results, fees, materials, timetables }: StudentPortalProps) {
  const [selectedTerm, setSelectedTerm] = useState("Term 1, 2026");
  const [activeTab, setActiveTab] = useState("results");

  const studentClass = getStudentClass(studentName);
  const admNo = studentAccounts[studentName] || "N/A";
  const myFees = fees[studentName] || { total: 45000, paid: 30000 };
  const balance = myFees.total - myFees.paid;

  const myResults = results.filter(
    (r) => r.student === studentName && r.term === selectedTerm
  );

  const myMaterials = materials.filter(
    (m) => m.class_name === studentClass || m.class_name === "All Classes"
  );

  // Helper check to identify image files for native inline rendering
  const isImageFile = (fileName: string) => {
    if (!fileName) return false;
    const lowerName = fileName.toLowerCase();
    return lowerName.endsWith(".png") || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || lowerName.endsWith(".webp");
  };

  const downloadReport = async () => {
    const total = myResults.reduce((s, r) => s + Number(r.marks), 0);
const mean = myResults.length ? (total / myResults.length).toFixed(1) : "0";
const overall = studentClass === 'Grade 10' ? getGrade10Grade(Number(mean)) : getGrade(Number(mean));

// Calculate class position
const classResults = results.filter((r) => r.className === studentClass && r.term === selectedTerm);
const studentTotals: Record<string, number> = {};
classResults.forEach((r) => {
  if (!studentTotals[r.student]) studentTotals[r.student] = 0;
  studentTotals[r.student] += r.marks;
});
const sorted = Object.entries(studentTotals).sort((a, b) => b[1] - a[1]);
const positionIndex = sorted.findIndex(([name]) => name === studentName);
const classPosition = positionIndex >= 0 ? positionIndex + 1 : null;


const totalStudents = classStudents[studentClass]?.length || sorted.length;
const positionSuffix = classPosition === 1 ? "st" : classPosition === 2 ? "nd" : classPosition === 3 ? "rd" : "th";
    const teacherComment =
      Number(mean) >= 75
        ? "Excellent performance. Maintain the spirit."
        : Number(mean) >= 60
        ? "Good work. Keep improving."
        : Number(mean) >= 45
        ? "Fair performance. More effort needed."
        : "Needs serious improvement.";
    const principalComment =
      Number(mean) >= 75
        ? "Excellent discipline and academic progress."
        : Number(mean) >= 60
        ? "Work harder for even better performance."
        : "More seriousness is required.";

    const rows = myResults
      .map(
        (r) =>
          `<tr><td style="border:1px solid #444;padding:10px;font-size:16px">${r.subject}</td><td style="border:1px solid #444;padding:10px;text-align:center;font-size:16px">${r.marks}</td><td style="border:1px solid #444;padding:10px;text-align:center;font-size:16px;font-weight:bold">${r.grade}</td><td style="border:1px solid #444;padding:10px;font-size:16px">${r.subject === 'Kiswahili' ? getKiswahiliComment(r.marks) : getComment(r.marks)}</td></tr>`
      )
      .join("");

    const feeBalance = myFees.total - myFees.paid;

    let logoSrc = "";
    try {
      const response = await fetch("https://v0-wamyisioloportal.vercel.app/wamy%20logggo.png");
      const imageBlob = await response.blob();
      logoSrc = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageBlob);
      });
    } catch {
      logoSrc = "";
    }

    const html = `<!DOCTYPE html><html><head><title>Report Form - ${studentName}</title></head><body style="background:#e7dfc2;padding:20px;font-family:Arial"><div style="max-width:860px;margin:auto;background:#f8f5e8;border:4px solid #333;padding:25px"><div style="display:flex;align-items:center;gap:20px"><img src="${logoSrc}" style="width:100px;height:100px;object-fit:contain" /><div style="flex:1;text-align:center"><h1 style="margin:0;font-size:38px;font-weight:900">WAMY ISIOLO HIGH SCHOOL</h1><p style="margin:4px 0;font-size:22px">P.O BOX 734-60300, ISIOLO</p></div></div><div style="margin-top:28px;font-size:24px;line-height:1.9;font-weight:bold"><div>STUDENT NAME: <span style="font-weight:normal">${studentName}</span></div><div>ADM NO.: <span style="font-weight:normal">${admNo}</span></div><div>CLASS: <span style="font-weight:normal">${studentClass}</span></div><div>TERM: <span style="font-weight:normal">${selectedTerm}</span></div></div><table style="width:100%;border-collapse:collapse;margin-top:24px"><thead><tr style="background:#efefe5"><th style="border:1px solid #444;padding:10px;font-size:18px">SUBJECTS</th><th style="border:1px solid #444;padding:10px;font-size:18px">MARKS</th><th style="border:1px solid #444;padding:10px;font-size:18px">GRADES</th><th style="border:1px solid #444;padding:10px;font-size:18px">COMMENT</th></tr></thead><tbody>${rows || '<tr><td colspan="4" style="text-align:center;padding:20px">No results for this term</td></tr>'}</tbody></table><div style="margin-top:28px;border-top:2px solid #555;padding-top:16px;font-size:22px;line-height:2"><div><strong>TOTAL MARKS:</strong> ${total}</div><div><strong>MEAN SCORE:</strong> ${mean}</div><div><strong>OVERALL GRADE:</strong> ${overall}</div>
${studentClass !== 'Grade 10' && classPosition ? `<div><strong>CLASS POSITION:</strong> ${classPosition}${positionSuffix} out of ${totalStudents} students</div>` : ""}</div><div style="margin-top:20px;border-top:2px solid #555;padding-top:16px;font-size:20px;line-height:2"><div><strong>TEACHER&apos;S COMMENT:</strong> ${teacherComment}</div><div><strong>PRINCIPAL&apos;S COMMENT:</strong> ${principalComment}</div></div><div style="margin-top:20px;border-top:2px solid #555;padding-top:16px;font-size:20px"><strong>FEE BALANCE:</strong> <span style="color:#a32d2d">KSh ${feeBalance.toLocaleString()}</span></div></div></body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${studentName}_${selectedTerm}_Report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="materials">📚 Materials</TabsTrigger>
          <TabsTrigger value="fees">Fee Statement</TabsTrigger>
          <TabsTrigger value="timetables">📅 Timetables</TabsTrigger>
        </TabsList>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Download Report Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">Select the term for your report form</p>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {termOptions.map((term) => (
                    <SelectItem key={term} value={term}>{term}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={downloadReport} className="w-full bg-[#146f3a] hover:bg-[#0f5a2e]">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">My Results — {selectedTerm}</CardTitle>
            </CardHeader>
            <CardContent>
              {myResults.length === 0 ? (
                <p className="text-sm text-muted-foreground">No results for {selectedTerm} yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.subject}</TableCell>
                        <TableCell>{result.marks}</TableCell>
                        <TableCell className="font-semibold">{result.grade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Materials for {studentClass}</CardTitle>
            </CardHeader>
            <CardContent>
              {myMaterials.length === 0 ? (
                <p className="text-sm text-muted-foreground">No materials posted yet.</p>
              ) : (
                <div className="space-y-3">
                  {myMaterials.map((m) => (
                    <div key={m.id} className="border rounded-md p-3 space-y-1">
                      <p className="font-medium text-sm">{m.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.subject} · {m.teacher_name} · {new Date(m.created_at).toLocaleDateString()}
                      </p>
                      {m.content && (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{m.content}</p>
                      )}
                      {m.file_url && (
                        <a
                          href={m.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-1 text-xs bg-[#1a56a0] text-white px-3 py-1 rounded-md"
                        >
                          📎 Download {m.file_name}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees Tab */}
        <TabsContent value="fees">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Fee Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Total Fees</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>KSh {myFees.total.toLocaleString()}</TableCell>
                    <TableCell>KSh {myFees.paid.toLocaleString()}</TableCell>
                    <TableCell className="text-destructive font-medium">
                      KSh {balance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {balance > 0 ? (
                <p className="text-xs text-muted-foreground mt-3">Please clear your fee balance.</p>
              ) : (
                <p className="text-xs text-[#27500a] mt-3">Fees fully paid.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timetables Tab - Direct Display Interface for Students */}
        <TabsContent value="timetables" className="space-y-4">
          {/* Teaching Timetables Block */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Teaching Timetables</CardTitle>
            </CardHeader>
            <CardContent>
              {timetables.filter((t) => t.type === "teaching").length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No teaching timetables uploaded yet.</p>
              ) : (
                <div className="space-y-4">
                  {timetables.filter((t) => t.type === "teaching").map((t) => (
                    <div key={t.id} className="border rounded-md p-4 space-y-2 bg-white shadow-sm">
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.term}</p>
                      </div>
                      
                      {isImageFile(t.file_name) ? (
                        <div className="border rounded-md overflow-hidden bg-slate-50 p-2 flex justify-center max-h-[600px] w-full">
                          <img 
                            src={t.file_url} 
                            alt={t.title} 
                            className="object-contain max-w-full h-auto rounded-md" 
                            loading="eager"
                          />
                        </div>
                      ) : (
                        <div className="border rounded-md bg-slate-50 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                            <FileText className="h-4 w-4 text-slate-500" />
                            {t.file_name}
                          </div>
                          <a 
                            href={t.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs bg-[#1a56a0] text-white px-3 py-1 rounded-md font-medium"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exam Timetables Block */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exam Timetables</CardTitle>
            </CardHeader>
            <CardContent>
              {timetables.filter((t) => t.type === "exam").length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No exam timetables uploaded yet.</p>
              ) : (
                <div className="space-y-4">
                  {timetables.filter((t) => t.type === "exam").map((t) => (
                    <div key={t.id} className="border rounded-md p-4 space-y-2 bg-white shadow-sm">
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.term}</p>
                      </div>
                      
                      {isImageFile(t.file_name) ? (
                        <div className="border rounded-md overflow-hidden bg-slate-50 p-2 flex justify-center max-h-[600px] w-full">
                          <img 
                            src={t.file_url} 
                            alt={t.title} 
                            className="object-contain max-w-full h-auto rounded-md" 
                            loading="eager"
                          />
                        </div>
                      ) : (
                        <div className="border rounded-md bg-slate-50 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                            <FileText className="h-4 w-4 text-slate-500" />
                            {t.file_name}
                          </div>
                          <a 
                            href={t.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs bg-[#146f3a] text-white px-3 py-1 rounded-md font-medium"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
