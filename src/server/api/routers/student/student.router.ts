import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { CreateStudentProfile } from "./student.input";



const studentRouter = createTRPCRouter({
  createProfile: publicProcedure
    .input(CreateStudentProfile)
    .mutation(async ({ input }) => {

      await Promise.allSettled([
        await db.studentProfile.create({
          data: {
            school: input.school,
            user: {
              connect: {
                id: input.userId
              }
            },
          }
        }),
        await db.user.update({
          data: {
            role: "STUDENT"
          },
          where: {
            id: input.userId
          }
        })
      ])
    }),
})

export { studentRouter }