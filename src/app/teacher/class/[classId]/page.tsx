import { Navbar } from "~/components/navbar";
import { api, HydrateClient } from "~/trpc/server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { auth } from "~/server/auth";
import { LessonCard } from "~/features/lesson/components/lesson-card";
import { Lesson } from "~/features/lesson/components/lesson";
import { Button, buttonVariants } from "~/components/ui/button";
import { ArrowLeft, Mail, Settings } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";

interface Page {
  params: Promise<{
    classId: string
  }>
}

export default async function Class({ params }: Page) {

  const classId = (await params).classId
  const session = await auth();
  const lessons = await api.teacher.class.lesson.getAllLessons()

  return (
    <HydrateClient>
      <main className="">
        <Navbar />
        <div className="flex items-center mb-6 mt-6 container mx-auto">
          <Link href={"/teacher/dashboard"} className={buttonVariants({ variant: "ghost", className: "mr-2" })}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          {/* <h1 className="text-2xl font-bold text-slate-800">{classData.name}</h1>
          <Badge className="ml-3 bg-sky-100 text-sky-700 hover:bg-sky-100">{classData.subject}</Badge>
          <Badge className="ml-2 bg-slate-100 text-slate-700 hover:bg-slate-100">{classData.gradeLevel}</Badge> */}

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-1" />
              Message Class
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Class Settings
            </Button>
          </div>
        </div>
        <Tabs defaultValue="lessons" className="mt-12">
          <div className="container mx-auto">
            <TabsList className="h-10 w-64">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="active_lessons">Active Lessons</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview">

          </TabsContent>
          <TabsContent value="active_lessons">
          </TabsContent>
        </Tabs>
      </main>
    </HydrateClient>
  );
}
