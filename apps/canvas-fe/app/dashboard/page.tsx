"use client";
import { Providers } from "@/app/providers";
import Dashboard from "@/components/pages/Dashboard";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [status]);

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  return (
    <Providers>
      <Dashboard session={session} />
    </Providers>
  );
}
