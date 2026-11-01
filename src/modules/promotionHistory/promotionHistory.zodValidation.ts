import z4 from "zod/v4";

const promotionHistoryIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid promotion history ID."),
});

export type TPromotionHistoryIdParamsZodSchema = z4.infer<
  typeof promotionHistoryIdParamsZodSchema
>;

const promotionHistoryEntityIdParamsZodSchema = z4.object({
  entity_id: z4.uuid("Invalid profile ID."),
});

export type TPromotionHistoryEntityIdParamsZodSchema = z4.infer<
  typeof promotionHistoryEntityIdParamsZodSchema
>;

export const promotionHistoryZodSchema = {
  promotionHistoryIdParamsZodSchema,
  promotionHistoryEntityIdParamsZodSchema,
};
