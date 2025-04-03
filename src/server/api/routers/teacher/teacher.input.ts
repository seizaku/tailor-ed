import { z } from "zod";



export const CreateTeacherProfile = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  school: z.string(),
})

export type CreateTeacherProfileType = z.infer<typeof CreateTeacherProfile>

export const CreateClass = z.object({
  className: z.string(),
  subject: z.string(),
  level: z.string(),
  description: z.string()
})

export type CreateClassType = z.infer<typeof CreateClass>