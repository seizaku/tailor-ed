import { Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

const CreateClass: React.FC = () => {
  return (
    <Card className="border-dashed hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Create New Class</CardTitle>
        <CardDescription>Add a new class to your dashboard</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-6">
        <Button variant="outline" className="rounded-full h-12 w-12">
          <Plus className="h-6 w-6" />
        </Button>
      </CardContent>
    </Card>
  )
}

export { CreateClass }