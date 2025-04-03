"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateClass, CreateTeacherProfile, type CreateClassType, type CreateTeacherProfileType } from "~/server/api/routers/teacher/teacher.input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { Session } from "next-auth";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



const StudentProfileForm: React.FC<{ session: Session }> = ({ session }) => {
  const router = useRouter();
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

  const { mutateAsync: createProfile, isPending } = api.student.createProfile.useMutation({})

  async function onSubmit(data: CreateTeacherProfileType & CreateClassType) {
    await createProfile({
      userId: data.userId,
      name: data.name,
      school: data.school,
    })
    toast.success(`Welcome ${data.name}!`)
    router.push('/student/dashboard')
    return;
  }

  return (
    <div className="max-w-sm w-full">
      <Card>
        <CardHeader>
          <CardTitle>
            Create Your Student Profile
          </CardTitle>
          <CardDescription>
            Tell us about yourself to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <div className="flex flex-1 items-center justify-between">
            <Button disabled={isPending} onClick={form.handleSubmit(onSubmit)} type="submit">Create Profile</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export { StudentProfileForm }