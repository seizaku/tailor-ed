import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
// import { Button, buttonVariants } from "~/components/ui/button"
// import { Users } from "lucide-react"
import type { GetAllClassQueryResult } from "~/server/api/routers/teacher/sub-routers/class.router.types"
import type { Session } from "next-auth"
// import Link from "next/link"

const ClassCard: React.FC<{ data: GetAllClassQueryResult, session: Session }> = ({ data, session }) => {

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{data.name}</CardTitle>
        <CardDescription className="mb-2 capitalize">{data.subject?.split("_").join(" ").toLowerCase()}</CardDescription>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Lessons:</span>
            <span className="font-medium">{data.Lessons.length ?? 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Completion Rate:</span>
            <span className="font-medium">{(data.Lessons.reduce((sum, lesson) => sum + (lesson.LessonCompletion.find(c => c.userId == session?.user.id)?.progress ?? 0), 0) / data.Lessons.length) || 0}%</span>
          </div>
        </div>
      </CardHeader>
      {/* <CardFooter>
        <Link href={`/teacher/class/${data.id}`} className={buttonVariants({ className: "w-full", variant: "outline" })}>
          <Users className="mr-2 h-4 w-4" />
          View Class
        </Link>
      </CardFooter> */}
    </Card>
  )
}

export { ClassCard }