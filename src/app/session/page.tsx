import { redirect } from "next/navigation";
import { getUserRole } from "@/data/getUserRole";

export default async function Home() {
  const userRole = await getUserRole();
  if (userRole === "admin") {
    redirect("/session/admin/dashboard");
  }
  redirect("/session/employee/profile");
}
