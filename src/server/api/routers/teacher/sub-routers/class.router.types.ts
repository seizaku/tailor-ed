import { Prisma } from "@prisma/client";

export const classInclude = Prisma.validator<Prisma.ClassInclude>()({
  Lessons: {
    include: {
      LessonCompletion: true
    }
  }
});

export type GetAllClassQueryResult = Prisma.ClassGetPayload<{
  include: typeof classInclude;
}>;
