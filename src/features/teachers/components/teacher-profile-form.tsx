"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateClass, CreateTeacherProfile, type CreateClassType, type CreateTeacherProfileType } from "~/server/api/routers/teacher/teacher.input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress"
import { Textarea } from "~/components/ui/textarea"
import { useState } from "react";
import type { Session } from "next-auth";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



const TeacherProfileForm: React.FC<{ session: Session }> = ({ session }) => {
  const router = useRouter();
  const [step, setStep] = useState(1)
  const form = useForm<CreateTeacherProfileType & CreateClassType>({
    resolver: zodResolver(CreateTeacherProfile.merge(CreateClass)),
    defaultValues: {
      userId: session.user.id,
      name: session.user.name ?? '',
      email: session.user.email ?? '',
      school: '',
      className: '',
      subject: '',
      level: '',
      description: ''
    }
  })

  const { mutateAsync: createProfile } = api.teacher.createProfile.useMutation({})

  async function onSubmit(data: CreateTeacherProfileType & CreateClassType) {
    await createProfile({
      userId: data.userId,
      name: data.name,
      email: data.email,
      school: data.school,
      className: data.className,
      subject: data.subject,
      level: data.level,
      description: data.description
    })
    toast.success(`Welcome ${data.name}!`)
    router.push('/teacher/dashboard')
    return;
  }

  return (
    <div className="max-w-sm w-full">
      <Progress value={50 * step} className="mb-4" />
      <Card>
        <CardHeader>
          {
            step == 1 && <>
              <CardTitle>
                Create Your Teacher Profile
              </CardTitle>
              <CardDescription>
                Tell us about yourself to get started
              </CardDescription>
            </>
          }
          {
            step == 2 && <>
              <CardTitle>
                Set Up Your Class
              </CardTitle>
              <CardDescription>
                {`Provide details about the class you'll be teaching`}
              </CardDescription>
            </>
          }
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step == 1 && <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input readOnly disabled placeholder="john.smith@school.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Western Mindanao State University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>}

              {step == 2 && <>
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
              </>}
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className="flex flex-1 items-center justify-between">
            {step == 1 ?
              <Button disabled={!form.formState.isValid} onClick={() => setStep(2)} type="button">Next</Button>
              :
              <>
                <Button onClick={() => setStep(1)} variant={"outline"}>Back</Button>
                <Button onClick={form.handleSubmit(onSubmit)} type="submit">Create Class</Button>
              </>
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export { TeacherProfileForm }