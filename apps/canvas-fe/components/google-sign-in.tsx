import { Button } from "@/components/ui/button";
import GoogleIcon from "./ui/googleIcon";
import { signIn } from "next-auth/react";

export default function GoogleButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="w-full transition-all hover:bg-muted/40 hover:cursor-pointer"
    >
      <GoogleIcon/>
      Google
    </Button>
  );
} 