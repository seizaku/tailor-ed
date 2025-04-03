import { Navbar } from "~/components/navbar";
import { api, HydrateClient } from "~/trpc/server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { auth } from "~/server/auth";
import { LessonCard } from "~/features/lesson/components/lesson-card";
import { Lesson } from "~/features/lesson/components/lesson";

export default async function Dashboard() {
  const session = await auth();
  const lessons = await api.teacher.class.lesson.getAllLessons()

  return (
    <HydrateClient>
      <main className="">
        <Navbar />
        <Tabs defaultValue="lessons" className="mt-12">
          <div className="flex items-center justify-center">
            <TabsList className="h-10 w-64">
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="active_lessons">Active Lessons</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="lessons">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto mt-4 gap-4">
              {lessons.map((data) => (
                <LessonCard key={data.lessonId} data={data} session={session!} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="active_lessons">
            <Lesson />
          </TabsContent>
        </Tabs>
      </main>
    </HydrateClient>
  );
}
