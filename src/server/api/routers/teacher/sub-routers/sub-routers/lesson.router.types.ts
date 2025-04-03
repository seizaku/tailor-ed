import { Prisma } from "@prisma/client";

export const lessonInclude = Prisma.validator<Prisma.LessonInclude>()({
  LessonCompletion: true
});

export type GetAllLessonQueryResult = Prisma.LessonGetPayload<{
  include: typeof lessonInclude;
}>;


export type Slide = {
  id: string;
  title: string;
  content: string;
  narration: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};

export type Lesson = {
  title: string;
  topic: string;
  slides: Slide[];
  quiz: QuizQuestion[];
};
