export const dynamic = 'force-dynamic';

import { getUserId } from "@/data/getUserIdServer";
import { getUserById } from "@/data/users/getUserById";
import { ProfilePersonalInfo } from "@/components/profile/profilePersonalInfo";
import { ProfilePreferences } from "@/components/profile/profile-preferences";
import { ProfileSecurity } from "@/components/profile/profile-security";

export default async function ProfilePage() {
  const userId = await getUserId();
  if (!userId) {
    return <div>Usuario no autenticado</div>;
  }

  const user = await getUserById(userId);
  if (!user) {
    return <div>Usuario no encontrado</div>;
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
