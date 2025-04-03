import { Navbar } from "~/components/navbar";
import { api, HydrateClient } from "~/trpc/server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { ClassCard } from "~/features/teachers/components/class-card";
import { CreateLessonDialog } from "~/features/lesson/components/dialogs/create-lesson/create-lesson-dialog";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { Lesson } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { CreateClassDialog } from "~/features/class/components/dialogs/create-class-dialog";

export default async function Dashboard() {
  const session = await auth()
  const classes = await api.teacher.class.getUserClasses()
  const lessons = await api.teacher.class.lesson.getAllLessons()

  return (
    <HydrateClient>
      <main className="">
        <Navbar />
        <Tabs defaultValue="classes" className="mt-12">
          <div className="flex items-center justify-center">
            <TabsList className="h-10 w-64">
              <TabsTrigger value="classes">My Classes</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="classes">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto mt-4 gap-4">
              {classes.map((data) => (
                <ClassCard session={session!} key={data.id} data={data} />
              ))}
              <CreateClassDialog />
            </div>
          </TabsContent>
          <TabsContent value="lessons">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto mt-4 gap-4">
              <CreateLessonDialog />
              {lessons.map((data) => (
                <Card key={data.lessonId} className=" hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="bg-sky-50 text-sky-700 hover:bg-sky-50">
                        {data.topic}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50">
                        {(JSON.parse(data.slides) as Lesson["slides"]).length} Slides
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{data.title}</CardTitle>
                  </CardHeader>

                  <CardFooter>
                    <Button variant={"outline"} className="w-full">
                      View Lesson
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {/* {lessons.map((item) => (
                <pre key={item.lessonId}>
                  <code>
                    {JSON.stringify(item.slides)}
                  </code>
                </pre>
              ))} */}


            </div>
          </TabsContent>
        </Tabs>
      </main>
    </HydrateClient>
  );
}
