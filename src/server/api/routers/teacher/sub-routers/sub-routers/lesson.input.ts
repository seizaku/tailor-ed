import { z } from "zod";


export const GenerateLessonInput = z.object({
  classId: z.string(),
  title: z.string(),
  topic: z.string(),
  description: z.string()
})

export type GenerateLessonInputType = z.infer<typeof GenerateLessonInput>

export const CreateLessonInput = z.object({
  classId: z.string(),
  title: z.string(),
  topic: z.string(),
  slides: z.any()
})

export type CreateLessonInputType = z.infer<typeof CreateLessonInput>


export const QuizScoreInput = z.object({
  lessonId: z.string(),
  correct: z.number(),
  total: z.number(),
  percentage: z.number(),
})

export type QuizScoreInputType = z.infer<typeof QuizScoreInput>
