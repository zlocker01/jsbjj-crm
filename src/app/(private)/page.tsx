export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getUserRole } from "@/data/getUserRole";

export default async function Home() {
  const userRole = await getUserRole();
  if (userRole === "admin") {
    redirect("/dashboard");
  }
  redirect("/employed");
}
