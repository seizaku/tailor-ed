/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import type React from "react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { GetAllLessonQueryResult } from "~/server/api/routers/teacher/sub-routers/sub-routers/lesson.router.types";
import type { Lesson } from "@prisma/client";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import type { Session } from "next-auth";
import useLessonStore from "../stores/lesson.store";


const LessonCard: React.FC<{ data: GetAllLessonQueryResult, session: Session }> = ({ data, session }) => {
  const lessonStore = useLessonStore();

  return (
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
        <CardTitle className="text-lg mt-2 p-0">{data.title}</CardTitle>
        <span className="text-sm font-medium">{data.LessonCompletion.find((item) => item.userId == session?.user.id)?.progress ?? 0}%</span>
        <Progress value={data.LessonCompletion.find((item) => item.userId == session?.user.id)?.progress} className="h-2 mb-4" />
        <Button onClick={() => lessonStore.startLesson({
          classId: data.classId,
          lessonId: data.lessonId,
          quiz: JSON.parse(data.quiz ?? "[]"),
          slides: JSON.parse(data.slides ?? "[]"),
          title: data.title,
          topic: data.topic
        })} className="w-full">
          {(data.LessonCompletion.find((item) => item.userId == session?.user.id)?.progress ?? 0) > 0 ? "Continue" : "Start"} Lesson
        </Button>
      </CardHeader>
    </Card>
  )
}

export { LessonCard }