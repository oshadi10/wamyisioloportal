"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Award, GraduationCap } from "lucide-react";

interface HomeContentProps {
  currentPage: string;
}

export function HomeContent({ currentPage }: HomeContentProps) {
  if (currentPage === "Home") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Welcome to Wamy Isiolo High School
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Wamy Isiolo High School - dedicated to academic excellence and holistic development. Our institution strives to nurture future leaders through quality education and character building.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Users className="h-8 w-8 text-[#1a56a0]" />
                <div>
                  <p className="text-2xl font-semibold">70+</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <BookOpen className="h-8 w-8 text-[#146f3a]" />
                <div>
                  <p className="text-2xl font-semibold">8</p>
                  <p className="text-xs text-muted-foreground">Staff Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Award className="h-8 w-8 text-[#f3d64d]" />
                <div>
                  <p className="text-2xl font-semibold">3</p>
                  <p className="text-xs text-muted-foreground">Classes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentPage === "About Us") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Wamy Isiolo High School is a premier institution in Isiolo County committed to nurturing academic and moral excellence. We provide a conducive learning environment that enables students to achieve their full potential.
          </p>
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-1">Our Mission</h4>
              <p className="text-sm text-muted-foreground">To provide quality education that transforms students into responsible citizens.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-1">Our Vision</h4>
              <p className="text-sm text-muted-foreground">To be a center of academic excellence and character formation.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentPage === "Academics") {
    const subjects = [
      "Mathematics",
      "English",
      "Kiswahili",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Arabic / IRE",
      "Business Studies",
      "Agriculture",
      "Literature",
      "General Science",
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Academic Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We offer a comprehensive curriculum covering all major subjects:
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {subjects.map((subject) => (
              <div
                key={subject}
                className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm"
              >
                <BookOpen className="h-4 w-4 text-[#1a56a0]" />
                {subject}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentPage === "Downloads") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Admission forms and fee structures are available from the school office or by contacting the administration.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Contact Information</h4>
            <p className="text-sm text-muted-foreground">P.O BOX 734-60300, ISIOLO</p>
            <p className="text-sm text-muted-foreground">Email: info@wamyisiolo.sc.ke</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
