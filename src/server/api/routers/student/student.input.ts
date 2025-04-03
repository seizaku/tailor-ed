import { z } from "zod";



export const CreateStudentProfile = z.object({
  userId: z.string(),
  name: z.string(),
  school: z.string(),
})

export type CreateStudentProfileType = z.infer<typeof CreateStudentProfile>
