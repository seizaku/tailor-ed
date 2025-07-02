import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { GoogleAuth } from "~/features/auth/components/google-auth";
import { HydrateClient } from "~/trpc/server";

export default async function Auth() {

  return (
    <HydrateClient>
      <main className="flex h-screen flex-col items-center justify-center gap-4 bg-accent">

        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">Next<span className="text-primary">Ed</span></h1>
          <p className="text-sm text-muted-foreground">Personalized learning for every student</p>
        </div>

        <Card className="max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-center">
              Welcome to NextEd
            </CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground">
              Sign in to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center">
            <GoogleAuth />
          </CardContent>
        </Card>

      </main>
    </HydrateClient>
  );
}
