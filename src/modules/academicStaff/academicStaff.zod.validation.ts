import z4 from "zod/v4";

const assignGradeGroupTeacherZodSchema = z4.object({
    class_id: z4.uuid({
        error: (issue)=>
            issue.input === undefined
        ?"Class ID is required."
        :"Invalid Class ID format."
    }),
    
    academicStaff_id: z4.uuid({
        error: (issue)=>
            issue.input === undefined
        ?"Academic staff ID is required."
        :"Invalid Academic staff ID format."
    }),

})
export type TAssignGradeGroupTeacherZodSchema = z4.infer<typeof assignGradeGroupTeacherZodSchema>

const updateGradeGroupTeacherZodSchema =z4.object({
    class_id: z4.uuid({
        error: (issue)=>
            issue.input === undefined
        ?"Class ID is required."
        :"Invalid Class ID format."
    }),
    old_academicStaff_id: z4.uuid({
        error: (issue)=>
            issue.input === undefined
        ?"Academic staff ID is required."
        :"Invalid Academic staff ID format."
    }),
    new_academicStaff_id: z4.uuid({
        error: (issue)=>
            issue.input === undefined
        ?"Academic staff ID is required."
        :"Invalid Academic staff ID format."
    }),
})
export const academicStaffZodSchema = {
    assignGradeGroupTeacherZodSchema,
    updateGradeGroupTeacherZodSchema
}