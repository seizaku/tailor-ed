"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { CreateClass, type CreateClassType } from "~/server/api/routers/teacher/teacher.input";
import { api } from "~/trpc/react";


const CreateClassDialog: React.FC = () => {
  const router = useRouter();
  const [isDialogOpen, setDialogOpen] = useState(false)
  const form = useForm<CreateClassType>({
    resolver: zodResolver(CreateClass),
    defaultValues: {
      className: '',
      description: '',
      level: '',
      subject: ''
    }
  })

  const { mutateAsync: createClass, isPending: isPending } = api.teacher.class.createClass.useMutation()

  async function onSubmit(data: CreateClassType) {
    const result = await createClass(data)
    console.log(result);
  }

  async function handleCreateClass(data: CreateClassType) {

    console.log({
      className: data.className,
      description: data.description,
      level: data.level,
      subject: data.subject
    })

    await createClass({
      className: data.className,
      description: data.description,
      level: data.level,
      subject: data.subject
    });

    toast.success("Class created!")
    setDialogOpen(false);
    form.reset()
    router.refresh()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Card className="border-dashed hover:shadow-lg hover-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Create a New Class</CardTitle>
            <CardDescription>Add a new class to your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Button variant="outline" className="rounded-full h-12 w-12 flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>Enter the details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. BSCS 2B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={() => (
                <FormItem>
                  <FormLabel>Primary Subject</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => form.setValue("subject", value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="physical_education">Physical Education</SelectItem>
                        <SelectItem value="computer_science">Computer Science</SelectItem>
                        <SelectItem value="foreign_language">Foreign Language</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={() => (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => form.setValue("level", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary School</SelectItem>
                        <SelectItem value="middle">Middle School</SelectItem>
                        <SelectItem value="high">High School</SelectItem>
                        <SelectItem value="college">College/University</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe your class, teaching style, or specific goals"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <div className="flex items-center justify-end gap-2">
            <Button disabled={isPending} onClick={form.handleSubmit(handleCreateClass)}>
              Create Class
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { CreateClassDialog }