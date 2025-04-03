"use client"
import { Button } from "~/components/ui/button"
import Image from "next/image";
import { signIn } from "next-auth/react";

const GoogleAuth: React.FC = () => {

  async function onGoogleSignIn() {
    await signIn("google", {
      redirectTo: "/",
    });
  }

  return <Button onClick={onGoogleSignIn} variant={"outline"} className="cursor-pointer">
    <Image src={'/google.webp'} height={18} width={18} alt="Google" />
    Continue with Google
  </Button>
}

export { GoogleAuth }