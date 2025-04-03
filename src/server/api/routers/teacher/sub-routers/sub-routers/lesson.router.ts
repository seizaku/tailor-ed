import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { CreateLessonInput, GenerateLessonInput, QuizScoreInput } from "./lesson.input";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { env } from "~/env";
import { lessonInclude, type Lesson } from "./lesson.router.types";
import { db } from "~/server/db";


const lessonRouter = createTRPCRouter({
  getAllLessons: publicProcedure.query(async ({ }) => {
    return await db.lesson.findMany({
      include: lessonInclude
    })
  }),
  generateLesson: publicProcedure.input(GenerateLessonInput).mutation(async ({ input }) => {

    const model = (new GoogleGenerativeAI(env.GEMINI_API_KEY)).getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompts = [
      `
      You are an AI that generates structured educational lessons based on user input. Create a detailed lesson with a title, topic, and description. 

      Title: ${input.title}
      Topic: ${input.topic}
      Description: ${input.description}

      The lesson should be in JSON format and include:

      - title: Lesson title  
      - slides: A detailed list of slides (at least 5), each with:  
        - id: Unique slide identifier  
        - title: Slide title  
        - content: In-depth educational text (several paragraphs)  
        - narration: A spoken version of the content (different)  
      - quiz: At least 5 multiple-choice questions, each with:  
        - question: The quiz question  
        - options: Answer choices  
        - answer: Correct option index  
      `
    ]

    const result = await model.generateContent(prompts);
    console.log(result.response.text())
    return JSON.stringify(JSON.parse((/\{[\s\S]*\}/.exec((result.response.text())))?.[0] ?? '{}') as Lesson);
  }),
  createLesson: publicProcedure
    .input(CreateLessonInput)
    .mutation(async ({ input }) => {

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-assignment
      const data = input.slides as any

      return await db.lesson.create({
        data: {
          Class: {
            connect: {
              id: input.classId
            }
          },
          title: input.title,
          topic: input.topic,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          slides: JSON.stringify(data.slides),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          quiz: JSON.stringify(data.quiz),
        }
      })
    }),
  finishLesson: publicProcedure.input(QuizScoreInput).mutation(async ({ input, ctx }) => {
    return await db.lessonCompletion.create({
      data: {
        progress: 100,
        score: input.percentage,
        lessonId: input.lessonId,
        userId: ctx.session!.user.id,
      }
    })
  })
})

export { lessonRouter }