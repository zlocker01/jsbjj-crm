"use client";

import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LandingHeroTextEditor } from "./landing-hero-text-editor";
import { LandingHeroImageEditor } from "./landing-hero-image-editor";

interface LandingHeroEditorProps {
  landing_id: string;
  heroContent: any;
  onChange: (field: string, value: string | File | undefined) => void;
  handleFileUpload: (file: File, callback: (value: string) => void) => void;
}

export function LandingHeroEditor({
  landing_id,
  heroContent,
  onChange,
}: LandingHeroEditorProps) {
  const heroSectionId = heroContent?.id || 1;
  return (
    <AccordionItem
      value="hero"
      className="border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
    >
      <AccordionTrigger className="dark:text-white border px-4 py-3 bg-gold dark:bg-black dark:hover:bg-goldHover transition-colors font-medium">
        Sección Principal (Hero)
      </AccordionTrigger>
      <AccordionContent className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30">
        <div className="space-y-4">
          <LandingHeroTextEditor landing_id={landing_id} onChange={onChange} />
          <LandingHeroImageEditor
            landing_id={landing_id}
            onChange={onChange}
            heroSectionId={heroSectionId}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
