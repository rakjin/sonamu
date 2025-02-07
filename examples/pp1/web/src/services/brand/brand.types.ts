import { z } from "zod";
import { BrandBaseSchema, BrandBaseListParams } from "./brand.generated";

// Brand - ListParams
export const BrandListParams = BrandBaseListParams;
export type BrandListParams = z.infer<typeof BrandListParams>;

// Brand - SaveParams
export const BrandSaveParams = BrandBaseSchema.partial({
  id: true,
  created_at: true,
});
export type BrandSaveParams = z.infer<typeof BrandSaveParams>;
