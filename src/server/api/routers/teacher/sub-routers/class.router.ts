import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { lessonRouter } from "./sub-routers/lesson.router";
import { classInclude } from "./class.router.types";
import { CreateClass } from "../teacher.input";




const classRouter = createTRPCRouter({
  getUserClasses: publicProcedure.query(async ({ ctx }) => {
    return await db.class.findMany({
      where: {
        userId: ctx.session?.user.id
      },
      include: classInclude
    })
  }),
  createClass: publicProcedure.input(CreateClass).mutation(async ({ input, ctx }) => {
    return await db.class.create({
      data: {
        name: input.className,
        description: input.description,
        subject: input.subject,
        level: input.level,
        teacher: {
          connect: {
            userId: ctx.session!.user.id
          }
        }
      },
    })
  }),
  lesson: lessonRouter
})

export { classRouter }