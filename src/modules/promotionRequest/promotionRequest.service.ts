import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { findPositionExistence } from "../../helperFunctions/cachedData/cache_positions";
import { findRoleExistence } from "../../helperFunctions/cachedData/cache_roles";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TActionPromotionRequestZodSchema, TCreatePromotionRequestZodSchema, TDeletePromotionRequestZodSchema } from "./promotionRequest.zod.validation";
import { Prisma } from "#db-client";

const MANAGEMENT_ROLE_TRACK = ["MANAGEMENT", "ADMIN"];
const ACADEMIC_ROLE_TRACK = ["ACADEMIC", "TEACHER_ADMIN"];
// =========================================================
// CREATE PROMOTION REQUEST SERVICE LAYER
// =========================================================
const createPromotionRequest = async (
  payload: TCreatePromotionRequestZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { user_id, old_role, new_role, old_position, new_position } = payload;

  // GET CLEAN ROLE POSITION
  const clean_old_role = old_role.trim().toUpperCase();
  const clean_new_role = new_role.trim().toUpperCase();
  const clean_old_position = old_position.trim().toUpperCase();
  const clean_new_position = new_position.trim().toUpperCase();

  // CHECK ACTUAL PROMOTION OR FAKE
  if(clean_old_role === clean_new_role && clean_old_position === clean_new_position){
    throw new AppError("Proposed role and position are identical to current records. Not promotable.", StatusCodes.BAD_REQUEST)
  };

  // CHECK STUDENT AND GOVERNING_BODY ROLES
  if(clean_old_role === "STUDENT" && clean_new_role === "STUDENT"){
    throw new AppError("A student cannot be promoted to another student role via the staff pipeline.",  StatusCodes.BAD_REQUEST)
  };
  if(clean_old_role === "GOVERNING_BODY" || clean_new_role === "GOVERNING_BODY"){
    throw new AppError("A governing body member cannot hold duplicate governing body tracks.",  StatusCodes.BAD_REQUEST)
  }

  // CHECK ROLE POSITION EXISTANCE
  const oldRoleExists = await findRoleExistence(clean_old_role);
  const newRoleExists = await findRoleExistence(clean_new_role);
  const oldPositionExists = await findPositionExistence(clean_old_position);
  const newPositionExists = await findPositionExistence(clean_new_position);

  return prisma.$transaction(async (tx) => {
    // CHECK USER EXISTANCE
    const targetUser = await tx.user.findUnique({
      where: { id: user_id },
      select: {
        current_role: { select: { role_name: true } },
        current_position: { select: { position_name: true } },
        management_staff_profile: { select: { id: true } },
        academic_staff_profile: { select: { id: true } },
        student_profile: { select: { id: true } },
        governing_body_profile: { select: { id: true } },
      },
    });
    if (!targetUser) {
      throw new AppError(`User not found.`, StatusCodes.NOT_FOUND);
    }

    // CHECK ROLE POSITION ARE SAME OR NOT WITH THE CURRENT ROLE AND POSITION
    if (
      clean_old_role !== targetUser.current_role?.role_name ||
      clean_old_position !== targetUser.current_position?.position_name
    ) {
      throw new AppError(
        "Provided old role or position fields do not match current database values.",
        StatusCodes.BAD_REQUEST,
      );
    }

    // CHECK PENDING PROMOTION REQUEST
    const pendingPromotionRequest = await tx.promotionRequest.findFirst({
      where: { user_id, promotion_request_status: "PENDING" },
    });
    if (pendingPromotionRequest) {
      throw new AppError(
        "A pending promotion request is already under review for this user.",
        StatusCodes.CONFLICT,
      );
    }

    // GET SUB PROFILE ID
    let management_staff_id: string | undefined;
    let academic_staff_id: string | undefined;
    let student_id: string | undefined;
    let governing_body_id: string | undefined;
    if (MANAGEMENT_ROLE_TRACK.includes(clean_old_role)) {
      management_staff_id = targetUser.management_staff_profile?.id;
    } else if (ACADEMIC_ROLE_TRACK.includes(clean_old_role)) {
      academic_staff_id = targetUser.academic_staff_profile?.id;
    } else if (clean_old_role === "STUDENT") {
      student_id = targetUser.student_profile?.id;
    } else if (clean_old_role === "GOVERNING_BODY") {
      governing_body_id = targetUser.governing_body_profile?.id;
    }

    // CREATE PROMOTION REQUEST
    const created = await tx.promotionRequest.create({
      data: {
        user_id,
        management_staff_id,
        academic_staff_id,
        student_id,
        governing_body_id,
        promotion_request_status: "PENDING",
        old_role_id: oldRoleExists.id,
        new_role_id: newRoleExists.id,
        old_position_id: oldPositionExists.id,
        new_position_id: newPositionExists.id,
        created_by_id: loggedInUser.user_id,
      },
    });

    const newAuditRecords = {
      user_id,
      management_staff_id,
      academic_staff_id,
      student_id,
      governing_body_id,
      promotion_request_status: "PENDING",
      old_role_id: oldRoleExists.id,
      new_role_id: newRoleExists.id,
      old_position_id: oldPositionExists.id,
      new_position_id: newPositionExists.id,
      created_by_id: loggedInUser.user_id,
    };

    const newValidAuditRecords = Object.fromEntries(
      Object.entries(newAuditRecords).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    );

    // CREATE AUDIT LOG
    await tx.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "promotionRequest",
        changed_by_id: loggedInUser.user_id,
        action: "CREATE",
        old_value: Prisma.JsonNull,
        new_value: newValidAuditRecords,
      },
    });
    return created;
  });
};

// =========================================================
// DELETE PROMOTION REQUEST SERVICE LAYER
// =========================================================
const deletePromotionRequest = async(
  payload:TDeletePromotionRequestZodSchema,
  loggedInUser:TLoggedInUser
)=>{
  const {promotion_request_id} = payload;
  return prisma.$transaction(async(tx)=>{
    // CHECK THE EXISTANCE OF THE PROMOTION REQUEST 
    const promotionRequest = await tx.promotionRequest.findUnique({
      where: {id: promotion_request_id},
      select: {
        user_id: true,
        management_staff_id: true,
        academic_staff_id: true,
        student_id: true,
        governing_body_id: true,
        promotion_request_status: true,
        old_role_id: true,
        new_role_id: true,
        old_position_id: true,
        new_position_id: true,
        created_by_id: true,
      }
    });
    if(!promotionRequest){
      throw new AppError(`The promotion request not found.`, StatusCodes.NOT_FOUND)
    };

    // CHECK THE PROMOTION STATUS IS PENDING OR NOT
    const status = promotionRequest.promotion_request_status
    if(status !== "PENDING"){
      throw new AppError(`The promotion request is ${status} already. Can not delete.`, StatusCodes.UNAUTHORIZED)
    };

    // DELETE THE PROMOTION REQUEST
    const deleted = await tx.promotionRequest.delete({
      where: {id: promotion_request_id}
    });

    // CREATE THE AUDIT LOG DATA
    const oldAuditRecords = {
      user_id: promotionRequest.user_id,
      management_staff_id: promotionRequest.management_staff_id,
      academic_staff_id: promotionRequest.academic_staff_id,
      student_id: promotionRequest.student_id,
      governing_body_id: promotionRequest.governing_body_id,
      promotion_request_status: promotionRequest.promotion_request_status,
      old_role_id: promotionRequest.old_role_id,
      new_role_id: promotionRequest.new_role_id,
      old_position_id: promotionRequest.old_position_id,
      new_position_id: promotionRequest.new_position_id,
      created_by_id: promotionRequest.created_by_id,
    };

    const newValidAuditRecords = Object.fromEntries(
      Object.entries(oldAuditRecords).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    );

    // CREATE AUDIT LOG
    await tx.auditLog.create({
      data: {
        entity_id: promotion_request_id,
        entity_name: "promotionRequest",
        changed_by_id: loggedInUser.user_id,
        action: "DELETE",
        old_value: newValidAuditRecords,
        new_value: Prisma.JsonNull
      }
    })
    return deleted;
  })
};

const actionPromotionRequest = async(
  payload: TActionPromotionRequestZodSchema,
  loggedInUser: TLoggedInUser,
)=>{
  const { promotion_request_id, action_status, rejection_reason, effective_date } = payload;
  const resolutionDate = effective_date ? new Date(effective_date) : new Date();
  return prisma.$transaction(async(tx)=>{
    // Fetch promotion request and check existance
    const promotionRequest = await tx.promotionRequest.findUnique({
      where: {id: promotion_request_id},
      include: {
        user: {
          select: {
            full_name: true, mobile_number: true
          }
        },
        old_role: {select: {role_name: true}},
        new_role: {select: {role_name: true}},
        old_position: {select: {position_name: true}},
        new_position: {select: {position_name: true}}
      }
    });
    if(!promotionRequest){
      throw new AppError("Promotion request not found.", StatusCodes.NOT_FOUND);
    };

    if(promotionRequest.promotion_request_status !== "PENDING"){
      throw new AppError(`This request has already been processed as ${promotionRequest.promotion_request_status}.`, StatusCodes.BAD_REQUEST);
    };
    
    const {user_id, management_staff_id, academic_staff_id, student_id, governing_body_id, new_role_id, new_position_id} = promotionRequest;

    const auditRecords: Prisma.AuditLogCreateManyInput[]=[]
    // Handle Rejection 
    if(action_status === "REJECTED"){

      // Update rejection
      const updated = await tx.promotionRequest.update({
        where: {id: promotion_request_id},
        data: {
          promotion_request_status: "REJECTED",
          rejection_reason,
          updated_by_id: loggedInUser.user_id
        }
      });

      // Create audit log
       await tx.auditLog.create({
        data: {
          entity_id: promotion_request_id,
          entity_name: "promotionRequest",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: { promotion_request_status: "PENDING", rejection_reason: null },
          new_value: { promotion_request_status: "REJECTED", rejection_reason },
        },
      });
      return updated
    }

    // Handle Approval 

    // Update Approval at Promotin Request
    const updatedPromotionRequest = await tx.promotionRequest.update({
      where: {id: promotion_request_id},
      data: {
        promotion_request_status: "APPROVED",
        updated_by_id: loggedInUser.user_id
      }
    });
    // Create audit log
    auditRecords.push({
        entity_id: promotion_request_id,
        entity_name: "promotionRequest",
        changed_by_id: loggedInUser.user_id,
        action: "UPDATE",
        old_value: { promotion_request_status: "PENDING" },
        new_value: { promotion_request_status: "APPROVED" },
      })

    // Prepare for pipelines
    const oldRoleName = promotionRequest.old_role.role_name;
    const newRoleName = promotionRequest.new_role.role_name;

    const isSourceManagement = MANAGEMENT_ROLE_TRACK.includes(oldRoleName);
    const isSourceAcademic = ACADEMIC_ROLE_TRACK.includes(oldRoleName);
    const isSourceStudent = oldRoleName === "STUDENT";
    const isSourceGoverningBody = oldRoleName === "GOVERNING_BODY"

    const isTargetManagement = MANAGEMENT_ROLE_TRACK.includes(newRoleName);
    const isTargetAcademic = ACADEMIC_ROLE_TRACK.includes(newRoleName);
    const isTargetStudent = newRoleName === "STUDENT";
    const isTargetGoverningBody = newRoleName === "GOVERNING_BODY";

    const isUnusual =(isSourceStudent === true && isTargetStudent=== true) || (isSourceGoverningBody===true && isTargetGoverningBody=== true);
    if(isUnusual){
      throw new AppError("The current and proposed roles cannot be identical for STUDENT or GOVERNING_BODY tracks.", StatusCodes.BAD_REQUEST)
    }
    const isSamePipeline = (isSourceManagement=== true && isTargetManagement=== true) || (isSourceAcademic === true && isTargetAcademic === true) ;

    let profileId = "";
    let targetEntityName = "";
    let activeHistoryId : string | undefined = "";
    if(management_staff_id){
      profileId = management_staff_id;
      targetEntityName = "managementStaff";
      const history = await tx.promotionHistory.findFirst({
        where: {management_staff_id, end_date: null}
      });
      activeHistoryId = history?.id;
    }else if(academic_staff_id){
      profileId =academic_staff_id;
      targetEntityName = "academicStaff";
      const history = await tx.promotionHistory.findFirst({
        where:{academic_staff_id, end_date: null}
      });
      activeHistoryId = history?.id
    }
    // Build common execution payload;
    if(isSamePipeline){
      
    }

  })
}
export const promotionRequestServices = {
  createPromotionRequest,
  deletePromotionRequest,
  actionPromotionRequest
};
