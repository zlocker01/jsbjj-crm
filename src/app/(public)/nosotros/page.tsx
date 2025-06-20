"use client";

export const dynamic = false;

import { Title } from "@/components/navegation/Title";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <Title text={"Nosotros"} />
    </div>
  );
};

export default page;
