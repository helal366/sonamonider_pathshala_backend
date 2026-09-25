### Auth routes

- POST /api/v1/smps/auth/login
  JSON: {
  "user_id": "USER_UUID"
  "user_password": "USER_PASSWORD"
  }

- POST /api/v1/smps/auth/logout
  JSON: {}

### User routes

- POST /api/v1/smps/user/create_user
  JSON: {
  "full_name": "USER NAME",
  "mobile_number":"USER MOBILE NUMBER",
  "email": "USER EMAIL ADDRESS",
  "gender": "USER GENDER",
  "role_name": "USER ROLE",
  "position_name": "USER POSITION",
  "joining_date": "JOINING ISO DATE STRING"
  }  
  ------> Only the required values are set here. See the zod schema to get the full requirement

- PATCH /api/v1/smps/user/change_password
  JSON: {
  "full_name": "USER NAME",
  "mobile_number":"USER MOBILE NUMBER",
  "current_password": "USER CURRENT PASSWORD",
  "new_password": "USER NEW PASSWORD",
  "confirm_password": "USER NEW PASSWORD"
  }

- POST /api/v1/smps/user/forget_password
  JSON: {
  "email": "USER EMAIL"
  }

- PATCH /api/v1/smps/user/promote_user_role_position
  JSON: {
  "full_name": "USER FULL NAME",
  "mobile_number": "USER 11 DIGIT BANGLADESHI MOBILE NUMBER",
  "position_name": "TARGET POSITION NAME",
  "role_name": "TARGET ROLE NAME",
  "promoted_date": "PROMOTION ISO DATE STRING"
  }

### Email routes

- POST /api/v1/smps/email/verify_email
  JSON: {
  "email": "USER EMAIL",
  "otp": "OTP SENT TO EMAIL"
  }

- POST /api/v1/smps/email/resend_otp_email_verify
  JSON: {
  "email": "USER EMAIL"
  }

- POST /api/v1/smps/email/send_otp_forget_password
  JSON: {}

- POST /api/v1/smps/email/resend_otp_forget_password
- POST /api/v1/smps/email/verify_email_forget_password

### Role routes

- POST /api/v1/smps/role/create_role
  JSON: {
  "role_name": "USER ROLE NAME",
  }

- PATCH /api/v1/smps/role/update_role
  JSON: {
  "current_role_name": "OLD OR MISSPELLED ROLE NAME",
  "new_role_name": "CORRECTED OR NEW ROLE NAME"
  }

- DELETE /api/v1/smps/role/update_role
  JSON: {
  "role_name": "TARGET ROLE NAME"
  }

- GET /api/v1/smps/role/get_roles
  JSON: {}

- GET /api/v1/smps/role/get_role:id
  JSON: {}

### Position routes

- POST /api/v1/smps/position/create_position
  JSON: {
  "role_name": "USER ROLE NAME",
  "position_name": "USER POSITION NAME"
  }

- PATCH /api/v1/smps/position/update_position
  JSON: {
  "present_position_name": "PRESENT POSITION NAME",
  "update_position_name": "UPDATE POSITION NAME"
  }

- DELETE /api/v1/smps/position/delete_position
  JSON: {
  "position_name": "POSITION NAME"
  }

- GET /api/v1/smps/position/get_positions
  JSON: {}

- GET /api/v1/smps/position/get_position:id
  JSON: {}

### Father details

- POST /api/v1/smps/father_details/create_father_details
  JSON: {
  "user_id": "USER_UUID"
  }
  ------> Only the required values are set here. See the zod schema to get the full requirement

- POST OR CONNECT /api/v1/smps/father_details/connect_father_details
JSON: {
"user_id": "USER_UUID"
"father_details_id": "FATHER DETAILS UUID"
}

- DELETE OR DISCONNECT /api/v1/smps/father_details/disconnect_father_details
  JSON: {
  "user_id": "USER_UUID"
  }

- PATCH /api/v1/smps/father_details/update_father_name
  JSON: {
  "user_id": "USER_UUID",
  "father_name": "USER FATHER NAME"
  }

- PATCH /api/v1/smps/father_details/update_father_nid
  JSON: {
  "user_id": "USER_UUID",
  "nid_no": "USER FATHER NID "
  }

- PATCH /api/v1/smps/father_details/update_father_occupation
  JSON: {
  "user_id": "USER_UUID",
  "occupation": "USER FATHER OCCUPATION"
  }

- PATCH /api/v1/smps/father_details/update_father_job_title
  JSON: {
  "user_id": "USER_UUID",
  "job_title": "USER FATHER JOB TITLE"
  }

- PATCH /api/v1/smps/father_details/update_father_educational_qualification
  JSON: {
  "user_id": "USER_UUID",
  "educational_qualification": "USER FATHER EDUCATIONAL QUALIFICATION"
  }

- PATCH /api/v1/smps/father_details/update_father_monthly_income
  JSON: {
  "user_id": "USER_UUID",
  "monthly_income": "USER FATHER MONTHLY INCOME"
  }

- PATCH /api/v1/smps/update_father_mobile_no_1
  JSON: {
  "user_id": "USER_UUID",
  "mobile_no_1": "USER FATHER MOBILE NUMBER 1"
  }

- PATCH /api/v1/smps/father_details/update_father_mobile_no_2
  JSON: {
  "user_id": "USER_UUID",
  "mobile_no_1": "USER FATHER MOBILE NUMBER 2"
  }

- PATCH /api/v1/smps/father_details/update_father_mobile_no_3
  JSON: {
  "user_id": "USER_UUID",
  "mobile_no_1": "USER FATHER MOBILE NUMBER 3"
  }

- DELETE /api/v1/smps/father_details/delete_father_nid
  JSON: {
  "user_id": "USER_UUID",
  }

- DELETE /api/v1/smps/father_details/delete_father_occupation
  JSON: {
  "user_id": "USER_UUID",
  }

- DELETE /api/v1/smps/father_details/delete_father_job_title
  JSON: {
  "user_id": "USER_UUID",
  }

- DELETE /api/v1/smps/father_details/delete_father_educational_qualification
  JSON: {
  "user_id": "USER_UUID",
  }

- DELETE /api/v1/smps/father_details/delete_father_monthly_income
  JSON: {
  "user_id": "USER_UUID",
  }

- DELETE /api/v1/smps/father_details/delete_father_mobile_no_1
  JSON: {
  "user_id": "USER_UUID",
  }

- DELETE /api/v1/smps/father_details/delete_father_mobile_no_2
  JSON: {
  "user_id": "USER_UUID",
  }

- DELETE /api/v1/smps/father_details/delete_father_mobile_no_3
  JSON: {
  "user_id": "USER_UUID",
  }

### Mother details

- POST /api/v1/smps/mother_details/create_mother_details
  JSON: {
  "user_id": "USER_UUID"
  }
------> Only the required values are set here. See the zod schema to get the full requirement

- POST OR CONNECT /api/v1/smps/mother_details/connect_mother_details
JSON: {
"user_id": "USER_UUID"
"father_details_id": "MOTHER DETAILS UUID"
}

- DELETE OR DISCONNECT /api/v1/smps/mother_details/disconnect_mother_details
  JSON: {
  "user_id": "USER_UUID"
  }

- PATCH /api/v1/smps/mother_details/update_mother_name
JSON: {
"user_id": "USER_UUID",
"mother_name": "USER MOTHER NAME"
}

- PATCH /api/v1/smps/mother_details/update_mother_nid
JSON: {
"user_id": "USER_UUID",
"nid_no": "USER MOTHER NID"
}

- PATCH /api/v1/smps/mother_details/update_mother_occupation
JSON: {
"user_id": "USER_UUID",
"occupation": "USER MOTHER OCCUPATION"
}

- PATCH /api/v1/smps/mother_details/update_mother_job_title
JSON: {
"user_id": "USER_UUID",
"job_title": "USER MOTHER JOB TITLE"
}

- PATCH /api/v1/smps/mother_details/update_mother_educational_qualification
JSON: {
"user_id": "USER_UUID",
"educational_qualification": "USER MOTHER EDUCATIONAL QUALIFICATION"
}

- PATCH /api/v1/smps/mother_details/update_mother_monthly_income
JSON: {
"user_id": "USER_UUID",
"monthly_income": "USER MOTHER MONTHLY INCOME"
}

- PATCH /api/v1/smps/mother_details/update_mother_mobile_no_1
JSON: {
"user_id": "USER_UUID",
"mobile_no_1": "USER MOTHER MOBILE NUMBER 1"
}

- PATCH /api/v1/smps/mother_details/update_mother_mobile_no_2
JSON: {
"user_id": "USER_UUID",
"mobile_no_2": "USER MOTHER MOBILE NUMBER 2"
}

- PATCH /api/v1/smps/mother_details/update_mother_mobile_no_3
JSON: {
"user_id": "USER_UUID",
"mobile_no_3": "USER MOTHER MOBILE NUMBER 3"
}

- DELETE /api/v1/smps/mother_details/delete_mother_nid
JSON: {
"user_id": "USER_UUID"
}

- DELETE /api/v1/smps/mother_details/delete_mother_occupation
JSON: {
"user_id": "USER_UUID"
}

- DELETE /api/v1/smps/mother_details/delete_mother_job_title
JSON: {
"user_id": "USER_UUID"
}

- DELETE /api/v1/smps/mother_details/delete_mother_educational_qualification
JSON: {
"user_id": "USER_UUID"
}

- DELETE /api/v1/smps/mother_details/delete_mother_monthly_income
JSON: {
"user_id": "USER_UUID"
}

- DELETE /api/v1/smps/mother_details/delete_mother_mobile_no_1
JSON: {
"user_id": "USER_UUID"
}

- DELETE /api/v1/smps/mother_details/delete_mother_mobile_no_2
JSON: {
"user_id": "USER_UUID"
}

- DELETE /api/v1/smps/mother_details/delete_mother_mobile_no_3
JSON: {
"user_id": "USER_UUID"
}


### Spouse information 
