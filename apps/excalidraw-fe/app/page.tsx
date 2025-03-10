"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  GithubIcon, 
  GoalIcon 
} from "lucide-react"
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRw5WIavzlkyyQcRcJUpu-9s4oliZ3APUPKA&s" alt="DrawFlow Logo" className="h-10 w-10 rounded-md"/>
          <h1 className="text-2xl font-bold">DrawFlow</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button variant="outline" onClick={() => signIn()}>
            Sign In
          </Button>
        </div>
      </nav>

      <div className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Unleash Your Creativity with DrawFlow
          </h1>
          <p className="text-xl text-muted-foreground">
            A collaborative drawing platform that makes creating together seamless and intuitive.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>
                Sign in with your preferred method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => signIn('google')} 
                variant="outline" 
                className="w-full"
              >
                <GoalIcon className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
              <Button 
                onClick={() => signIn('github')} 
                variant="outline" 
                className="w-full"
              >
                <GithubIcon className="mr-2 h-5 w-5" />
                Continue with GitHub
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <img 
            src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/lp-cms/media/HP_hero_Excalidraw_editor_playground.png" 
            alt="DrawFlow Preview" 
            className="rounded-xl shadow-2xl"
          />
        </div>
      </div>

      <footer className="container mx-auto px-4 py-6 text-center">
        <p className="text-muted-foreground">
          © 2024 DrawFlow. All rights reserved.
        </p>
      </footer>
    </main>
  )
}

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       Excalidraw Fe
//     </div>
//   );
// }
 