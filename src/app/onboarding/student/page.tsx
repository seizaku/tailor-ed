import { StudentProfileForm } from "~/features/students/components/student-profile";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function CreateStudentProfile() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex h-screen flex-col items-center justify-center gap-4 bg-accent">
        <StudentProfileForm session={session!} />
      </main>
    </HydrateClient>
  );
}
