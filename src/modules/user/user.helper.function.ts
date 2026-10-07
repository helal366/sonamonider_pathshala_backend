import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import { IBuildInitialAuditRecordsPayload, IDynamicProfilePayload, IExistencePayload, IFindSubProfilePayload, IUserCount } from "./user.interface.js";
import { Prisma } from "#db-client";

const isManagement = ["MANAGEMENT"]

const userExistence = async ({
  role_name: role,
  full_name,
  mobile_number,
}: IExistencePayload) => {
  if (isManagement.includes(role)) {
    return await prisma.managementStaff.findUnique({
      where: {
        management_full_name_mobile_unique: {
          full_name,
          mobile_number,
        },
      },
    });
  } else if (role === "STUDENT") {
    return await prisma.student.findUnique({
      where: {
        student_full_name_mobile_unique: {
          full_name,
          mobile_number,
        },
      },
    });
  } else if (role === "ACADEMIC") {
    return await prisma.academicStaff.findUnique({
      where: {
        academic_full_name_mobile_unique: {
          full_name,
          mobile_number,
        },
      },
    });
  } else if (role === "GOVERNING_BODY") {
    return await prisma.governingBody.findUnique({
      where: {
        governing_body_full_name_mobile_unique: {
          full_name,
          mobile_number,
        },
      },
    });
  }
  return null;
};

const userCount = async ({ role_name: role, mobile_number }: IUserCount) => {
  if (isManagement.includes(role)) {
    return await prisma.managementStaff.count({ where: { mobile_number } });
  } else if (role === "STUDENT") {
    return await prisma.student.count({ where: { mobile_number } });
  } else if (role === "GOVERNING_BODY") {
    return await prisma.governingBody.count({ where: { mobile_number } });
  } else if (role === "ACADEMIC") {
    return await prisma.academicStaff.count({ where: { mobile_number } });
  }
  return 0;
};

const userCreationRolePostionCheck = (
  role_name: string,
  position_name: string,
) => {
  // role_name and position_name are or create user not of loggedInUser
  // CHECK THE ROLE IS PERMITTED OR NOT.
  if (
    role_name !== "MANAGEMENT" &&
    role_name !== "ACADEMIC" &&
    role_name !== "STUDENT" &&
    role_name !== "GOVERNING_BODY"
  ) {
    throw new AppError(
      `The user with the provided role ${role_name} is not allowed to create.`,
      StatusCodes.UNAUTHORIZED,
    );
  }

  // CHECK THE POSITION IS PERMITTED OR NOT.
  if (
    position_name !== "MANAGEMENT_STAFF" &&
    position_name !== "ACADEMIC_STAFF" &&
    position_name !== "STUDENT" &&
    position_name !== "GOVERNING_BODY"
  ) {
    throw new AppError(
      `The user with the provided position ${position_name} is not allowed to create.`,
      StatusCodes.UNAUTHORIZED,
    );
  };

  // CHECK ROLE AND POSITION COMBINATION TO CREATE USER
  if(role_name === "STUDENT" && position_name !== "STUDENT"){
    throw new AppError(`User with role STUDENT can create with position STUDENT.`, StatusCodes.BAD_REQUEST)
  }else if(role_name === "GOVERNING_BODY" && position_name !== "GOVERNING_BODY"){
    throw new AppError(`User with role GOVERNING_BODY can create with position GOVERNING_BODY.`, StatusCodes.BAD_REQUEST)
  }else if(role_name === "MANAGEMENT" && position_name !== "MANAGEMENT_STAFF"){
    throw new AppError(`User with role MANAGEMENT can create with position MANAGEMENT_STAFF.`, StatusCodes.BAD_REQUEST)
  }else if(role_name === "ACADEMIC" && position_name !== "ACADEMIC_STAFF"){
    throw new AppError(`User with role ACADEMIC can create with position ACADEMIC_STAFF.`, StatusCodes.BAD_REQUEST)
  };
  
};

const buildDynamicProfileData = (payload: IDynamicProfilePayload)=>{
    const {
    cleanRole,
    full_name,
    mobile_number,
    email,
    positionId,
    roleId,
    loggedInUserId,
    active_class_id,
  } = payload;

  let targetEntityName = "";
  const profileData: Record<string, any> = {};

  if(isManagement.includes(cleanRole)){
    targetEntityName = "ManagementStaff";
    profileData.management_staff_profile = {
      create: {
        full_name,
        mobile_number,
        email,
        current_position: {connect: {id:positionId}},
        current_role: {connect: {id: roleId}},
        created_by: {connect: {id: loggedInUserId}}
      }
    }
  }else if (cleanRole === "ACADEMIC") {
    targetEntityName = "AcademicStaff";
    profileData.academic_staff_profile = {
      create: {
        full_name,
        mobile_number,
        email,
        current_position: { connect: { id: positionId } },
        current_role: { connect: { id: roleId } },
        created_by: { connect: { id: loggedInUserId } },
      },
    };
  }else if (cleanRole === "STUDENT") {
    if (!active_class_id) {
      throw new AppError("active_class_id is required to onboard a Student profile.", StatusCodes.BAD_REQUEST);
    }
    targetEntityName = "Student";
    profileData.student_profile = {
      create: {
        full_name,
        mobile_number,
        email,
        active_class: { connect: { id: active_class_id } },
        created_by: { connect: { id: loggedInUserId } },
      },
    };
  }else if (cleanRole === "GOVERNING_BODY") {
    targetEntityName = "GoverningBody";
    profileData.governing_body_profile = {
      create: {
        full_name,
        mobile_number,
        email,
        created_by: { connect: { id: loggedInUserId } },
      },
    };
  }
  return { profileData, targetEntityName };
};

const findSubProfileId = (payload: IFindSubProfilePayload) =>{
  const {cleanRole, createdUser, targetEntityName} = payload
  let subProfileId = "";
        if (isManagement.includes(cleanRole))
          subProfileId = createdUser.management_staff_profile?.id || "";
        if (cleanRole === "ACADEMIC")
          subProfileId = createdUser.academic_staff_profile?.id || "";
        if (cleanRole === "STUDENT")
          subProfileId = createdUser.student_profile?.id || "";
        if (cleanRole === "GOVERNING_BODY")
          subProfileId = createdUser.governing_body_profile?.id || "";

        if (!subProfileId) {
          throw new AppError(
            `Failed to initialize associated ${targetEntityName} profile record during onboarding.`,
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }
        return subProfileId
};

const buildInitialAuditRecords = (
  payload: IBuildInitialAuditRecordsPayload
): Prisma.AuditLogCreateManyInput[] => {
  const {
    userId,
    subProfileId,
    targetEntityName,
    full_name,
    mobile_number,
    email,
    cleanRole,
    cleanPosition,
    roleId,
    positionId,
    loggedInUserId,
  } = payload;
  return [
    {
      entity_id: userId,
      entity_name: "User",
      old_value: Prisma.JsonNull,
      new_value: {
        full_name,
        mobile_number,
        email,
        role_name: cleanRole,
        position_name: cleanPosition,
      } as Prisma.InputJsonValue,
      action: "CREATE",
      changed_by_id: loggedInUserId,
    },
    {
      entity_id: subProfileId,
      entity_name:
        targetEntityName === "ManagementStaff"
          ? "managementStaff"
          : targetEntityName,
      old_value: Prisma.JsonNull,
      new_value: {
        full_name,
        mobile_number,
        email,
        role_id: roleId,
        position_id: positionId,
      } as Prisma.InputJsonValue,
      action: "CREATE",
      changed_by_id: loggedInUserId,
    },
  ];
}
export const userHelperFunction = {
  userExistence,
  userCount,
  userCreationRolePostionCheck,
  buildDynamicProfileData,
  findSubProfileId,
  buildInitialAuditRecords
};
