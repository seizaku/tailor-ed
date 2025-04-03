"use client"
import { Navbar } from "~/components/navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { LessonCard } from "~/features/lesson/components/lesson-card";
import { Lesson } from "~/features/lesson/components/lesson";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import useLessonStore from "~/features/lesson/stores/lesson.store";

export default function Dashboard() {
  const session = useSession();
  const lessonStore = useLessonStore();
  const { data: lessons, isFetched } = api.teacher.class.lesson.getAllLessons.useQuery()

  return (
    <main className="">
      <Navbar />
      <Tabs value={lessonStore.activeTab} defaultValue="lessons" className="mt-12">
        <div className="flex items-center justify-center">
          <TabsList className="h-10 w-64">
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="active_lessons">Active Lessons</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="lessons">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto mt-4 gap-4">
            {isFetched && lessons?.map((data) => (
              <LessonCard key={data.lessonId} data={data} session={session.data!} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active_lessons">
          <Lesson />
        </TabsContent>
      </Tabs>
    </main>
  );
}
