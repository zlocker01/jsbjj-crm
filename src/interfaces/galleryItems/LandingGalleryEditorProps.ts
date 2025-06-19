import { GalleryFormData } from "./GalleryFormData";

export interface LandingGalleryEditorProps {
  galleryContent: GalleryFormData;
  onChange: (gallery: GalleryFormData) => void;
  handleFileUpload: (file: File, callback: (value: string) => void) => void;
}
