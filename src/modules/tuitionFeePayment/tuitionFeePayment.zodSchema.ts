import { BillingFrequency, StudentFeeType } from "#db-client"
import z4 from "zod/v4"
// =========================================================
// Create Tuition Fee Payment Route
// =========================================================
const createTuitionFeePaymentZodSchema = z4.object({
    academic_year_name: z4.string(),
    fee_type: z4.enum(StudentFeeType, ""), 
    billing_frequency: z4.enum(BillingFrequency), 
    billing_period_key: z4.string()
})
export type TCreateTuitionFeePaymentZodSchema = z4.infer<typeof createTuitionFeePaymentZodSchema>
export const tuitionFeePaymentZodSchema = {
    createTuitionFeePaymentZodSchema
} 