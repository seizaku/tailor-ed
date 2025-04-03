import { TeacherProfileForm } from "~/features/teachers/components/teacher-profile-form";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function CreateTeacherProfile() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex h-screen flex-col items-center justify-center gap-4 bg-accent">
        <TeacherProfileForm session={session!} />
      </main>
    </HydrateClient>
  );
}
