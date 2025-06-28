"use client";

import { LandingEditorClient } from "@/components/landing-editor/landing-editor-client";
import type { ClientWrapperProps } from "@/interfaces/client/ClientWrapperProps";

export function ClientWrapper({
  landingId,
  initialContent,
}: ClientWrapperProps) {
  return (
    <LandingEditorClient
      landingId={landingId}
      initialContent={initialContent}
    />
  );
}
