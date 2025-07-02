import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {

  const session = await auth();

  if (!session?.user) {
    redirect("/auth")
  }
  console.log(session.user)

  if (session.user.role) {
    redirect(`/${session.user.role.toLowerCase()}/dashboard`)
  }

  return (
    <HydrateClient>
      <main className="flex h-screen flex-col items-center justify-center gap-4 bg-accent">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">Inclusiv<span className="text-primary">Ed</span></h1>
          <p className="text-sm text-muted-foreground">Personalizeds learning for every student</p>
        </div>

        <Card className="max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-center">
              Welcome to InclusivEd
            </CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground">
              Select your role to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Link href={"/onboarding/student"} className={buttonVariants({ variant: "default" })}>
                {`I'm a Student`}
              </Link>
              <Link href={"/onboarding/teacher"} className={buttonVariants({ variant: "outline" })}>
                {`I'm a Teacher`}
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Your learning journey begins here
            </p>
          </CardFooter>
        </Card>

      </main>
    </HydrateClient>
  );
}
