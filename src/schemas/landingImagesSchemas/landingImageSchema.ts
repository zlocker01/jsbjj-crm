import { z } from "zod";

export const landingImageSchema = z.object({
  image: z.instanceof(File),
});

export type HeroImageData = z.infer<typeof landingImageSchema>;
