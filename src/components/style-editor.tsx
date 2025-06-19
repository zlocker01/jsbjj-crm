"use client";

import { useId } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StyleEditorProps {
  styles: any;
  onChange: (styles: any) => void;
}

export function StyleEditor({ styles, onChange }: StyleEditorProps) {
  const primaryColorId = useId();
  const secondaryColorId = useId();
  const accentColorId = useId();
  const backgroundColorId = useId();
  const textColorId = useId();
  const headingFontId = useId();
  const bodyFontId = useId();

  const handleColorChange = (colorKey: string, value: string) => {
    onChange({
      colors: {
        ...styles.colors,
        [colorKey]: value,
      },
    });
  };

  const handleFontChange = (fontKey: string, value: string) => {
    onChange({
      fonts: {
        ...styles.fonts,
        [fontKey]: value,
      },
    });
  };

  const handleSpacingChange = (spacingKey: string, value: number) => {
    onChange({
      spacing: {
        ...styles.spacing,
        [spacingKey]: `${value}rem`,
      },
    });
  };

  return (
    <Tabs defaultValue="colors">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="colors">Colores</TabsTrigger>
        <TabsTrigger value="typography">Tipografía</TabsTrigger>
        <TabsTrigger value="spacing">Espaciado</TabsTrigger>
      </TabsList>

      <TabsContent value="colors" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={primaryColorId}>Color Primario</Label>
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: styles.colors.primary }}
            />
            <Input
              id={primaryColorId}
              type="text"
              value={styles.colors.primary}
              onChange={(e) => handleColorChange("primary", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={secondaryColorId}>Color Secundario</Label>
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: styles.colors.secondary }}
            />
            <Input
              id={secondaryColorId}
              type="text"
              value={styles.colors.secondary}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={accentColorId}>Color de Acento</Label>
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: styles.colors.accent }}
            />
            <Input
              id={accentColorId}
              type="text"
              value={styles.colors.accent}
              onChange={(e) => handleColorChange("accent", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={backgroundColorId}>Color de Fondo</Label>
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: styles.colors.background }}
            />
            <Input
              id={backgroundColorId}
              type="text"
              value={styles.colors.background}
              onChange={(e) => handleColorChange("background", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={textColorId}>Color de Texto</Label>
          <div className="flex gap-2">
            <div
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: styles.colors.text }}
            />
            <Input
              id={textColorId}
              type="text"
              value={styles.colors.text}
              onChange={(e) => handleColorChange("text", e.target.value)}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="typography" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={headingFontId}>Fuente de Títulos</Label>
          <Input
            id={headingFontId}
            value={styles.fonts.heading}
            onChange={(e) => handleFontChange("heading", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={bodyFontId}>Fuente de Texto</Label>
          <Input
            id={bodyFontId}
            value={styles.fonts.body}
            onChange={(e) => handleFontChange("body", e.target.value)}
          />
        </div>
      </TabsContent>

      <TabsContent value="spacing" className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label>Espaciado de Sección: {styles.spacing.section}</Label>
            <Slider
              defaultValue={[Number.parseFloat(styles.spacing.section)]}
              max={8}
              step={0.5}
              onValueChange={(value: number[]) =>
                handleSpacingChange("section", value[0])
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label>Espaciado de Elementos: {styles.spacing.element}</Label>
            <Slider
              defaultValue={[Number.parseFloat(styles.spacing.element)]}
              max={4}
              step={0.25}
              onValueChange={(value: number[]) =>
                handleSpacingChange("element", value[0])
              }
              className="mt-2"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
