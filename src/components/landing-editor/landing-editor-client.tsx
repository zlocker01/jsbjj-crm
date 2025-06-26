"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink } from "lucide-react";
import { LandingEditor } from "@/components/landing-editor/landing-editor";

interface LandingEditorClientProps {
  landingId: string;
  initialContent: any;
}

export function LandingEditorClient({
  landingId,
  initialContent,
}: LandingEditorClientProps) {
  const { toast } = useToast();
  const [content, setContent] = useState(initialContent);

  const handleContentChange = (newContent: any) => {
    setContent({ ...content, ...newContent });
  };

  const handlePublish = () => {
    toast({
      title: "Cambios publicados",
      description: "Tu landing page ha sido actualizada correctamente.",
      variant: "success",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Editor de Landing Page
          </h1>
        </div>
        <p className="text-muted-foreground">
          Personaliza tu landing page para atraer más clientes
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 order-2 lg:order-1">
          <LandingEditor
            content={content}
            onChange={handleContentChange}
            landing_id={landingId}
          />
        </div>
      </div>
    </div>
  );
}
