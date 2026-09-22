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
  "position_name": "USER POSITION"
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

- PATCH /api/v1/smps/user/change_role
  JSON: {
  "full_name": "USER NAME",
  "mobile_number":"USER MOBILE NUMBER",
  "role_name": "USER ROLE",
  "position_name": "USER POSITION"
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
- POST /api/v1/smps/email/resend_otp_forget_password
- POST /api/v1/smps/email/verify_email_forget_password

### Role routes

- POST /api/v1/smps/role/create_role
- PATCH /api/v1/smps/role/update_role

### Position routes

- ##Create position: ## /api/v1/smps/position/create_position

### Father details

- POST /api/v1/smps/father_details/create_father_details

- POST OR CONNECT /api/v1/smps/father_details/connect_father_details

- DELETE OR DISCONNECT /api/v1/smps/father_details/disconnect_father_details
  JSON: {
  "user_id": "USER_UUID"
  }

- PATCH /api/v1/smps/father_details/update_father_name
  JSON: {
  "user_id": "USER_ID",
  "father_name": "Mohammad Karim"
  }

- PATCH /api/v1/smps/father_details/update_father_nid
  JSON: {
  "user_id": "USER_ID",
  "nid_no": "1234567890"
  }

- PATCH /api/v1/smps/father_details/update_father_occupation
  JSON: {
  "user_id": "USER_ID",
  "occupation": "Businessman"
  }

- PATCH /api/v1/smps/father_details/update_father_job_title
  JSON: {
  "user_id": "USER_ID",
  "job_title": "Senior Manager"
  }

- PATCH /api/v1/smps/father_details/update_father_educational_qualification
  JSON: {
  "user_id": "USER_ID",
  "educational_qualification": "BACHELOR"
  }

- PATCH /api/v1/smps/father_details/update_father_monthly_income
  JSON: {
  "user_id": "USER_ID",
  "monthly_income": "50000"
  }

- PATCH /api/v1/smps/update_father_mobile_no_1
  JSON: {
  "user_id": "USER_ID",
  "mobile_no_1": "01712345678"
  }

- PATCH /api/v1/smps/father_details/update_father_mobile_no_2
  JSON: {
  "user_id": "USER_ID",
  "mobile_no_2": "01812345678"
  }

- PATCH /api/v1/smps/father_details/update_father_mobile_no_3
  JSON: {
  "user_id": "USER_ID",
  "mobile_no_3": "01912345678"
  }

- DELETE /api/v1/smps/father_details/delete_father_nid
  JSON: {
  "user_id": "USER_ID"
  }

- DELETE /api/v1/smps/father_details/delete_father_occupation
  JSON: {
  "user_id": "USER_ID"
  }

- DELETE /api/v1/smps/father_details/delete_father_job_title
  JSON: {
  "user_id": "USER_ID"
  }

- DELETE /api/v1/smps/father_details/delete_father_educational_qualification
  JSON: {
  "user_id": "USER_ID"
  }

- DELETE /api/v1/smps/father_details/delete_father_monthly_income
  JSON: {
  "user_id": "USER_ID"
  }

- DELETE /api/v1/smps/father_details/delete_father_mobile_no_1
  JSON: {
  "user_id": "USER_ID"
  }

- DELETE /api/v1/smps/father_details/delete_father_mobile_no_2
  JSON: {
  "user_id": "USER_ID"
  }

- DELETE /api/v1/smps/father_details/delete_father_mobile_no_3
  JSON: {
  "user_id": "USER_ID"
  }
