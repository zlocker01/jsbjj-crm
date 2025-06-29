"use client";

export const dynamic = 'force-dynamic';

import { Title } from "@/components/navegation/Title";
import { Login } from "@/components/auth/Login";
import { OAuth } from "@/components/auth/OAuth";
import Header from "@/components/landing-page/header";
// import { InfoDialog } from '@/components/InfoDialog';
// import { MagicLinkAuth } from '@/components/auth/MagicLinkAuth';

const page = () => {
  return (
    <div className="flex flex-col justify-around items-center">
      <Header />
      <div className="flex flex-col justify-center items-center mt-28 gap-3">
        <Title text={"Iniciar Sesión"} />
        {/* <InfoDialog description="Utilizamos MagicLink para iniciar sesión. MagicLink es una forma moderna y más segura de acceder a tu cuenta sin necesidad de recordar contraseñas. Cada vez que desees iniciar sesión, recibirás un enlace único en tu correo electrónico." /> */}
        <Login />
        {/* <MagicLinkAuth /> */}
        <OAuth />
      </div>
    </div>
  );
};

export default page;
