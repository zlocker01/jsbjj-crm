"use client";

import { Title } from "@/components/navegation/Title";
import ContactForm from "@/components/landing-page/ContactForm";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <ContactForm />
    </div>
  );
};

export default page;
