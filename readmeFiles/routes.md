## Auth routes

- Log In
- POST /api/v1/smps/auth/login
  JSON:

```json
{
  "user_name": "USER_NAME_OR_MOBILE_NUMBER",
  "user_password": "USER_PASSWORD"
}
```

- Log Out
- POST /api/v1/smps/auth/logout
  JSON:

```json
{}
```

## Email routes

- Verify Email
- POST /api/v1/smps/email/verify_email
  JSON:

```json
{
  "email": "USER_EMAIL",
  "otp": "123456"
}
```

- Resend Email Verification OTP
- POST /api/v1/smps/email/resend_otp_email_verify
  JSON:

```json
{
  "email": "USER_EMAIL"
}
```

- Send Forgot Password OTP
- POST /api/v1/smps/email/send_otp_forget_password
  JSON:

```json
{
  "email": "USER_EMAIL"
}
```

- Resend Forgot Password OTP
- POST /api/v1/smps/email/resend_otp_forget_password
  JSON:

```json
{
  "email": "USER_EMAIL"
}
```

- Verify Forgot Password Email
- POST /api/v1/smps/email/verify_email_forget_password
  JSON:

```json
{
  "email": "USER_EMAIL",
  "otp": "123456"
}
```

## User routes

- Create User
- POST /api/v1/smps/user/create_user
  JSON:

```json
{
  "full_name": "USER_FULL_NAME",
  "mobile_number": "01712345678",
  "gender": "GENDER_VALUE",
  "email": "USER_EMAIL",
  "position_name": "USER_POSITION",
  "role_name": "USER_ROLE",
  "joining_date": "2026-01-01T00:00:00.000Z"
}
```

------> Only the required values are set here. See the zod schema to get the full requirement

- Change Password
- PATCH /api/v1/smps/user/change_password
  JSON:

```json
{
  "current_password": "CURRENT_PASSWORD",
  "new_password": "NEW_PASSWORD",
  "confirm_password": "NEW_PASSWORD"
}
```

- Request Password Reset
- POST /api/v1/smps/user/forget_password
  JSON:

```json
{
  "email": "USER_EMAIL"
}
```

- Promote User Role and Position
- PATCH /api/v1/smps/user/promote_user_role_position
  JSON:

```json
{
  "full_name": "USER_FULL_NAME",
  "mobile_number": "01712345678",
  "position_name": "TARGET_POSITION",
  "role_name": "TARGET_ROLE",
  "promoted_date": "2026-01-01T00:00:00.000Z"
}
```

- Change User Position
- PATCH /api/v1/smps/user/change_position
  JSON:

```json
{
  "full_name": "USER_FULL_NAME",
  "mobile_number": "01712345678",
  "position_name": "TARGET_POSITION"
}
```

- Update a User Field as Admin
- PATCH /api/v1/smps/user/update_user_single_field_admin
  JSON:

```json
{
  "user_id": "USER_UUID",
  "field": "FIELD_NAME",
  "value": "FIELD_VALUE"
}
```

- Update a User Field as Super Admin
- PATCH /api/v1/smps/user/update_user_single_field_super_admin
  JSON:

```json
{
  "user_id": "USER_UUID",
  "field": "FIELD_NAME",
  "value": true
}
```

- Update User Name
- PATCH /api/v1/smps/user/update_user_name
  JSON:

```json
{
  "user_id": "USER_UUID",
  "user_name": "NEW_USER_NAME"
}
```

- Update User Password
- PATCH /api/v1/smps/user/update_user_password
  JSON:

```json
{
  "user_id": "USER_UUID",
  "user_password": "NEW_PASSWORD"
}
```

## Role routes

- Create Role
- POST /api/v1/smps/role/create_role
  JSON:

```json
{
  "role_name": "ROLE_NAME"
}
```

- Update Role
- PATCH /api/v1/smps/role/update_role
  JSON:

```json
{
  "current_role_name": "CURRENT_ROLE_NAME",
  "new_role_name": "NEW_ROLE_NAME"
}
```

- Delete Role
- DELETE /api/v1/smps/role/delete_role
  JSON:

```json
{
  "role_name": "ROLE_NAME"
}
```

- Get All Roles
- GET /api/v1/smps/role/get_roles
  JSON:

```json
{}
```

- Get a Role by ID
- GET /api/v1/smps/role/get_role/:id
  JSON:

```json
{}
```

## Position routes

- Create Position
- POST /api/v1/smps/position/create_position
  JSON:

```json
{
  "position_name": "POSITION_NAME",
  "role_name": "ROLE_NAME"
}
```

- Update Position
- PATCH /api/v1/smps/position/update_position
  JSON:

```json
{
  "present_position_name": "CURRENT_POSITION_NAME",
  "update_position_name": "NEW_POSITION_NAME"
}
```

- Delete Position
- DELETE /api/v1/smps/position/delete_position
  JSON:

```json
{
  "position_name": "POSITION_NAME"
}
```

- Get All Positions
- GET /api/v1/smps/position/get_positions
  JSON:

```json
{}
```

- Get a Position by ID
- GET /api/v1/smps/position/get_position/:id
  JSON:

```json
{}
```

## Address routes

- Create User Address
- POST /api/v1/smps/user/address/create_address
  JSON:

```json
{
  "required_id": "USER_UUID",
  "thana": "THANA_NAME",
  "district": "DISTRICT_NAME",
  "owner_type": "ADDRESS_OWNER_TYPE",
  "address_type": "ADDRESS_TYPE"
}
```

------> Only the required values are set here. See the zod schema to get the full requirement

- Delete User Address
- DELETE /api/v1/smps/user/address/delete_address
  JSON:

```json
{
  "required_id": "USER_UUID",
  "owner_type": "ADDRESS_OWNER_TYPE",
  "address_type": "ADDRESS_TYPE"
}
```

- Update User Address Field
- PATCH /api/v1/smps/user/address/update_address_field
  JSON:

```json
{
  "required_id": "USER_UUID",
  "field": "ADDRESS_FIELD",
  "value": "FIELD_VALUE",
  "owner_type": "ADDRESS_OWNER_TYPE",
  "address_type": "ADDRESS_TYPE"
}
```

## Father details routes

- Create Father Details
- POST /api/v1/smps/father_details/create_father_details
  JSON:

```json
{
  "user_id": "USER_UUID",
  "father_name": "FATHER_NAME"
}
```

------> Only the required values are set here. See the zod schema to get the full requirement

- Connect Father Details
- POST /api/v1/smps/father_details/connect_father_details
  JSON:

```json
{
  "user_id": "USER_UUID",
  "father_details_id": "FATHER_DETAILS_UUID"
}
```

- Disconnect Father Details
- PATCH /api/v1/smps/father_details/disconnect_father_details
  JSON:

```json
{
  "user_id": "USER_UUID"
}
```

- Update Father Details Field
- PATCH /api/v1/smps/father_details/update_father_details_field
  JSON:

```json
{
  "user_id": "USER_UUID",
  "field": "FATHER_DETAILS_FIELD",
  "value": "FIELD_VALUE"
}
```

## Mother details routes

- Create Mother Details
- POST /api/v1/smps/mother_details/create_mother_details
  JSON:

```json
{
  "user_id": "USER_UUID",
  "mother_name": "MOTHER_NAME"
}
```

------> Only the required values are set here. See the zod schema to get the full requirement

- Connect Mother Details
- POST /api/v1/smps/mother_details/connect_mother_details
  JSON:

```json
{
  "user_id": "USER_UUID",
  "mother_details_id": "MOTHER_DETAILS_UUID"
}
```

- Update Mother Details Field
- PATCH /api/v1/smps/mother_details/update_mother_details_field
  JSON:

```json
{
  "user_id": "USER_UUID",
  "field": "MOTHER_DETAILS_FIELD",
  "value": "FIELD_VALUE"
}
```

- Disconnect Mother Details
- PATCH /api/v1/smps/mother_details/disconnect_mother_details
  JSON:

```json
{
  "user_id": "USER_UUID"
}
```

## Spouse information routes

- Create Spouse Information
- POST /api/v1/smps/spouse_information/create
  JSON:

```json
{
  "user_id": "USER_UUID",
  "full_name": "SPOUSE_FULL_NAME"
}
```

------> Only the required values are set here. See the zod schema to get the full requirement

- Delete Spouse Information
- DELETE /api/v1/smps/spouse_information/delete
  JSON:

```json
{
  "user_id": "USER_UUID"
}
```

- Update Spouse Information Field
- PATCH /api/v1/smps/spouse_information/update_spouse_information_field
  JSON:

```json
{
  "user_id": "USER_UUID",
  "field": "SPOUSE_INFORMATION_FIELD",
  "value": "FIELD_VALUE"
}
```

## Class routes

- Create Class
- POST /api/v1/smps/class/create
  JSON:

```json
{
  "class_name": "CLASS_NAME"
}
```

- Delete Class
- DELETE /api/v1/smps/class/delete/:class_id
  JSON:

```json
{
  "params": {
    "class_id": "CLASS_UUID"
  }
}
```

- Update Class Field
- PATCH /api/v1/smps/class/update/:class_id
  JSON:

```json
{
  "params": {
    "class_id": "CLASS_UUID"
  },
  "body": {
    "field": "class_name",
    "value": "NEW_CLASS_NAME"
  }
}
```

- Get All Classes
- GET /api/v1/smps/class
  JSON:

```json
{}
```

## Student routes

- Readmit Student
- PATCH /api/v1/smps/student/readmission
  JSON:

```json
{
  "student_id": "STUDENT_UUID"
}
```

## Academic year routes

- Create Academic Year
- POST /api/v1/smps/academic_year/create
  JSON:

```json
{
  "academic_year_name": "2026-2027"
}
```

- Delete Academic Year
- DELETE /api/v1/smps/academic_year/delete
  JSON:

```json
{
  "academic_year_id": "ACADEMIC_YEAR_UUID"
}
```

- Update Academic Year Field
- PATCH /api/v1/smps/academic_year/update_field
  JSON:

```json
{
  "academic_year_id": "ACADEMIC_YEAR_UUID",
  "field": "academic_year_name",
  "value": "2027-2028"
}
```

- Get All Academic Years
- GET /api/v1/smps/academic_year
  JSON:

```json
{}
```

- Get an Academic Year by ID
- GET /api/v1/smps/academic_year/:id
  JSON:

```json
{
  "params": {
    "academic_year_id": "ACADEMIC_YEAR_UUID"
  }
}
```

## Academic result routes

- Create Academic Result
- POST /api/v1/smps/academic_result/create
  JSON:

```json
{
  "required_id": "STAFF_OR_GOVERNING_BODY_UUID",
  "role_name": "ROLE_NAME",
  "position_name": "POSITION_NAME"
}
```

------> Only the required values are set here. See the zod schema to get the full requirement

- Delete Academic Result
- POST /api/v1/smps/academic_result/delete
  JSON:

```json
{
  "academic_result_id": "ACADEMIC_RESULT_UUID"
}
```

- Update Academic Result Field
- PATCH /api/v1/smps/academic_result/update_field
  JSON:

```json
{
  "academic_result_id": "ACADEMIC_RESULT_UUID",
  "field": "ACADEMIC_RESULT_FIELD",
  "value": "FIELD_VALUE"
}
```

- Get All Academic Results
- GET /api/v1/smps/academic_result
  JSON:

```json
{}
```

- Get an Academic Result by ID
- GET /api/v1/smps/academic_result/:academic_result_id
  JSON:

```json
{
  "params": {
    "academic_result_id": "ACADEMIC_RESULT_UUID"
  }
}
```

- Get Academic Result by Staff ID
- GET /api/v1/smps/academic_result/:staff_id
  JSON:

```json
{
  "params": {
    "staff_id": "STAFF_UUID",
    "staff_role_name": "STAFF_ROLE_NAME"
  }
}
```
