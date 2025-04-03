import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { CreateClass, CreateTeacherProfile } from "./teacher.input";
import { classRouter } from "./sub-routers/class.router";



const teacherRouter = createTRPCRouter({
  createProfile: publicProcedure
    .input(CreateTeacherProfile.merge(CreateClass))
    .mutation(async ({ input }) => {

      await Promise.allSettled([
        await db.teacherProfile.create({
          data: {
            school: input.school,
            user: {
              connect: {
                id: input.userId
              }
            },
            Class: {
              create: {
                name: input.className,
                description: input.description,
                subject: input.subject,
                level: input.level
              }
            }
          }
        }),
        await db.user.update({
          data: {
            role: "TEACHER"
          },
          where: {
            id: input.userId
          }
        })
      ])
    }),
  class: classRouter
})

export { teacherRouter }