"use client"
import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";


const Navbar: React.FC = () => {
  return <header className="sticky top-0 left-0 h-16 w-full border-b flex items-center">
    <div className="grid grid-cols-2 place-items-center w-full">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <BookOpen />
          <h1 className="text-2xl font-bold">Inclusiv<span className="text-primary">Ed</span></h1>
        </div>
      </div>

      {/* <ul className="flex items-center gap-2">
        <li>
          <Link href={'/teacher/dashboard'} className={buttonVariants({ variant: "ghost" })}>
            <Home className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link href={'/teacher/lessons'} className={buttonVariants({ variant: "ghost" })}>
            <BookOpen className="h-5 w-5 mr-2" />
            Lessons
          </Link>
        </li>
      </ul> */}

      {/* <Avatar>
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
       */}
      <Button onClick={async () => await signOut({
        redirectTo: "/auth"
      })} variant={"ghost"}>Logout</Button>
    </div>
  </header>
}

export { Navbar }