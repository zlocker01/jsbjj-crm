export interface LandingHeroEditorProps {
  landing_id: string;
  onChange: (field: string, value: string | File | undefined) => void;
  handleFileUpload?: (file: File, callback: (value: string) => void) => void;
  heroSectionId: number;
}
