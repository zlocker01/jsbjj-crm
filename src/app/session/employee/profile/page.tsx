import { getUserId } from "@/data/getUserIdServer";
import { redirect } from "next/navigation";
import { getUserById } from "@/data/users/getUserById";
import { ProfilePersonalInfo } from "@/components/profile/profilePersonalInfo";
import { ProfilePreferences } from "@/components/profile/profile-preferences";
import { ProfileSecurity } from "@/components/profile/profile-security";

export default async function EmployeeProfile() {
  const userId = await getUserId();
  if (!userId) {
    redirect('/login');
  }
  const user = await getUserById(userId);

  if (user?.role !== 'empleado') {
    redirect('/login');
  }

  return (
    <div className="flex flex-col gap-5 justify-center">
      <ProfilePersonalInfo userId={userId} user={user} />
      <div className="flex flex-col md:flex-row justify-between gap-5">
        <ProfilePreferences />
        <ProfileSecurity />
      </div>
    </div>
  );
}
