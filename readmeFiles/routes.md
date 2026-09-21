### Auth routes
* ##Auth login: ## POST /api/v1/smps/auth/login
* ##Auth logout: ## POST /api/v1/smps/auth/logout

### User routes
* ##Create user: ## /api/v1/smps/user/create_user
* ##Change password: ## /api/v1/smps/user/change_password
* ##Forget passsword: ## /api/v1/smps/user/forget_password

### Email routes
* ##Verify email after create user: ## /api/v1/smps/email/verify_email
* ##Resend OTP to verify email after create user: ## /api/v1/smps/email/resend_otp_email_verify
* ##Send OTP to recover forget password: ## /api/v1/smps/email/send_otp_forget_password
* ##Resend OTP to recover forget password: ## /api/v1/smps/email/resend_otp_forget_password
* ##Verify email for forget password: ## /api/v1/smps/email/verify_email_forget_password

### User patch routes
* ##Change user position: ## /api/v1/smps/user_patch/change_user_position

### Role routes
* ##Create role: ## /api/v1/smps/role/create_role
* ##Update role: ## /api/v1/smps/role/update_role

### Position routes
* ##Create position: ## /api/v1/smps/position/create_position

### Father details
* POST /api/v1/smps/father_details/create_father_details

* POST ## /api/v1/smps/father_details/connect_father_details

* PATCH /father-details/father-name
JSON: {
  "user_id": "USER_ID",
  "father_name": "Mohammad Karim"
}

* PATCH /api/v1/smps/father-details/nid-no
JSON: {
  "user_id": "USER_ID",
  "nid_no": "1234567890"
}

* PATCH /api/v1/smps/father-details/occupation
JSON: {
  "user_id": "USER_ID",
  "occupation": "Businessman"
}

* PATCH /api/v1/smps/father-details/job-title
JSON: {
  "user_id": "USER_ID",
  "job_title": "Senior Manager"
}

* PATCH /api/v1/smps/father-details/educational-qualification
JSON: {
  "user_id": "USER_ID",
  "educational_qualification": "BACHELOR"
}

* PATCH /api/v1/smps/father-details/monthly-income
JSON: {
  "user_id": "USER_ID",
  "monthly_income": "50000"
}

* PATCH /api/v1/smps/father-details/mobile-no-1
JSON: {
  "user_id": "USER_ID",
  "mobile_no_1": "01712345678"
}

* PATCH /api/v1/smps/father-details/mobile-no-2
JSON: {
  "user_id": "USER_ID",
  "mobile_no_2": "01812345678"
}

* PATCH /api/v1/smps/father-details/mobile-no-3
JSON: {
  "user_id": "USER_ID",
  "mobile_no_3": "01912345678"
}