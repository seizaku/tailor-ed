"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Accordion } from "@radix-ui/react-accordion";
import { FileText, Lightbulb, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { GenerateLessonInput, type GenerateLessonInputType, type CreateLessonInputType } from "~/server/api/routers/teacher/sub-routers/sub-routers/lesson.input";
import type { Lesson } from "~/server/api/routers/teacher/sub-routers/sub-routers/lesson.router.types";
import { api } from "~/trpc/react";


const CreateLessonDialog: React.FC = () => {
  const router = useRouter();
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<Lesson | null>(null)
  const classes = api.teacher.class.getUserClasses.useQuery()
  const form = useForm<GenerateLessonInputType>({
    resolver: zodResolver(GenerateLessonInput),
    defaultValues: {
      classId: '',
      title: '',
      topic: '',
      description: ''
    }
  })

  const { mutateAsync: generateLesson, isPending: isPendingGenerate } = api.teacher.class.lesson.generateLesson.useMutation()
  const { mutateAsync: createLesson, isPending: isPendingCreate } = api.teacher.class.lesson.createLesson.useMutation()

  async function onSubmit(data: GenerateLessonInputType) {
    const result = await generateLesson(data)
    console.log(result);
    setGeneratedContent(JSON.parse(result) as Lesson)
  }

  async function handleCreateLesson(data: CreateLessonInputType) {
    await createLesson({
      classId: data.classId,
      title: data.title,
      topic: data.topic,
      slides: generatedContent
    });
    setDialogOpen(false);
    form.reset()
    router.refresh()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Card className="border-dashed hover:shadow-lg hover-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Create a New Lesson</CardTitle>
            <CardDescription>Plan and structure your next lesson.</CardDescription>
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
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>Enter the details below and our AI will help you create a personalized lesson.</DialogDescription>
        </DialogHeader>
        {!generatedContent ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="classId"
                render={() => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => form.setValue("classId", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.data?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. Introduction to Machine Learning" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="eg. Supervised Learning" {...field} />
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
                        placeholder="Describe what you want to teach in this lesson"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        ) : (
          <div className="py-4">
            <h3 className="font-medium mb-2">Generated Lesson: {generatedContent.title}</h3>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="slides">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Slides ({generatedContent.slides.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3 pl-6">
                      {generatedContent.slides.map((slide, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <p className="font-medium">{slide.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{slide.content}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="quiz">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    <span>Quiz Questions ({generatedContent.quiz.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3 pl-6">
                      {generatedContent.quiz.map((question, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <p className="font-medium">{question.question}</p>
                          <div className="mt-2 space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <Badge
                                  variant={optIndex === question.answer ? "default" : "outline"}
                                  className={
                                    optIndex === question.answer
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : ""
                                  }
                                >
                                  {optIndex === question.answer ? "Correct" : "Option"}
                                </Badge>
                                <span className="ml-2 text-sm">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        <DialogFooter>
          <div className="flex items-center justify-end gap-2">
            <Button disabled={isPendingGenerate || !form.formState.isValid} variant={!generatedContent ? "default" : "outline"} onClick={form.handleSubmit(onSubmit)}>
              {!generatedContent ?
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Content
                </> :
                "Regenerate Content"}
            </Button>
            {generatedContent && (
              <Button disabled={isPendingCreate} onClick={form.handleSubmit(handleCreateLesson)}>
                Create Lesson
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { CreateLessonDialog }