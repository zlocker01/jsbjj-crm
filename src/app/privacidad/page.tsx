"use client";

export const dynamic = "force-static";

import { Title } from "@/components/navegation/Title";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <Title text={"Términos de Privacidad"} />
    </div>
  );
};

export default page;
