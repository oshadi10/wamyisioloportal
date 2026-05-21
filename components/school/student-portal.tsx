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
import { Download } from "lucide-react";
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
} from "@/lib/school-data";

interface StudentPortalProps {
  studentName: string;
  results: Result[];
  fees: Record<string, FeeRecord>;
}

export function StudentPortal({ studentName, results, fees }: StudentPortalProps) {
  const [selectedTerm, setSelectedTerm] = useState("Term 1, 2026");

  const studentClass = getStudentClass(studentName);
  const admNo = studentAccounts[studentName] || "N/A";
  const myFees = fees[studentName] || { total: 45000, paid: 30000 };
  const balance = myFees.total - myFees.paid;

  const myResults = results.filter(
    (r) => r.student === studentName && r.term === selectedTerm
  );

  const downloadReport = async () => {
    const total = myResults.reduce((s, r) => s + Number(r.marks), 0);
    const mean = myResults.length ? (total / myResults.length).toFixed(1) : "0";
    const overall = studentClass === 'Grade 10' ? getGrade10Grade(Number(mean)) : getGrade(Number(mean));
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
          `<tr><td style="border:1px solid #444;padding:10px;font-size:16px">${r.subject}</td><td style="border:1px solid #444;padding:10px;text-align:center;font-size:16px">${r.marks}</td><td style="border:1px solid #444;padding:10px;text-align:center;font-size:16px;font-weight:bold">${r.grade}</td><td style="border:1px solid #444;padding:10px;font-size:16px">${getComment(r.marks)}</td></tr>`
      )
      .join("");

    const feeBalance = myFees.total - myFees.paid;

    // Convert logo to base64
    let logoSrc = "";
    try {
      const response = await fetch("https://v0-wamyisioloportal.vercel.app/wamy_logggo.png");
      const imageBlob = await response.blob();
      logoSrc = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageBlob);
      });
    } catch {
      logoSrc = "";
    }

    const html = `<!DOCTYPE html><html><head><title>Report Form - ${studentName}</title></head><body style="background:#e7dfc2;padding:20px;font-family:Arial"><div style="max-width:860px;margin:auto;background:#f8f5e8;border:4px solid #333;padding:25px"><div style="display:flex;align-items:center;gap:20px"><img src="${logoSrc}" style="width:100px;height:100px;object-fit:contain" /><div style="flex:1;text-align:center"><h1 style="margin:0;font-size:38px;font-weight:900">WAMY ISIOLO HIGH SCHOOL</h1><p style="margin:4px 0;font-size:22px">P.O BOX 734-60300, ISIOLO</p></div></div><div style="margin-top:28px;font-size:24px;line-height:1.9;font-weight:bold"><div>STUDENT NAME: <span style="font-weight:normal">${studentName}</span></div><div>ADM NO.: <span style="font-weight:normal">${admNo}</span></div><div>CLASS: <span style="font-weight:normal">${studentClass}</span></div><div>TERM: <span style="font-weight:normal">${selectedTerm}</span></div></div><table style="width:100%;border-collapse:collapse;margin-top:24px"><thead><tr style="background:#efefe5"><th style="border:1px solid #444;padding:10px;font-size:18px">SUBJECTS</th><th style="border:1px solid #444;padding:10px;font-size:18px">MARKS</th><th style="border:1px solid #444;padding:10px;font-size:18px">GRADES</th><th style="border:1px solid #444;padding:10px;font-size:18px">COMMENT</th></tr></thead><tbody>${rows || '<tr><td colspan="4" style="text-align:center;padding:20px">No results for this term</td></tr>'}</tbody></table><div style="margin-top:28px;border-top:2px solid #555;padding-top:16px;font-size:22px;line-height:2"><div><strong>TOTAL MARKS:</strong> ${total}</div><div><strong>MEAN SCORE:</strong> ${mean}</div><div><strong>OVERALL GRADE:</strong> ${overall}</div></div><div style="margin-top:20px;border-top:2px solid #555;padding-top:16px;font-size:20px;line-height:2"><div><strong>TEACHER&apos;S COMMENT:</strong> ${teacherComment}</div><div><strong>PRINCIPAL&apos;S COMMENT:</strong> ${principalComment}</div></div><div style="margin-top:20px;border-top:2px solid #555;padding-top:16px;font-size:20px"><strong>FEE BALANCE:</strong> <span style="color:#a32d2d">KSh ${feeBalance.toLocaleString()}</span></div></div></body></html>`;

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
      <div className="grid md:grid-cols-2 gap-4">
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
      </div>

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
    </div>
  );
}
