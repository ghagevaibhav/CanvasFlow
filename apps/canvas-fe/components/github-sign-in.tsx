import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Github } from "lucide-react";
const GithubButton = () => {
  return (
      <Button
        variant="outline"
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="w-full transition-all hover:bg-muted/40 hover:cursor-pointer"
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
  );
};

export default GithubButton;
