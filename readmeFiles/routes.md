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


### User Patch Routes

1. Update Full Name

- PATCH `/api/v1/smps/user_patch/update_full_name`
JSON:
```json
{
  "user_id": "USER_UUID",
  "full_name": "John Doe"
}
````

2. Update Gender
* PATCH `/api/v1/smps/user_patch/update_gender`
JSON:
```json
{
  "user_id": "USER_UUID",
  "gender": "MALE"
}
```

3. Update Blood Group
* PATCH `/api/v1/smps/user_patch/update_blood_group`
JSON:
```json
{
  "user_id": "USER_UUID",
  "blood_group": "A_POSITIVE"
}
```

4. Update Date of Birth
* PATCH `/api/v1/smps/user_patch/update_date_of_birth`
JSON:
```json
{
  "user_id": "USER_UUID",
  "date_of_birth": "2005-05-15"
}
```

5. Update Height
* PATCH `/api/v1/smps/user_patch/update_height_in_cm`
JSON:
```json
{
  "user_id": "USER_UUID",
  "height_in_cm": 170
}
```

6. Update Weight
* PATCH `/api/v1/smps/user_patch/update_weight_in_kg`
JSON:
```json
{
  "user_id": "USER_UUID",
  "weight_in_kg": 65
}
```

7. Update Religion
* PATCH `/api/v1/smps/user_patch/update_religion`
JSON:
```json
{
  "user_id": "USER_UUID",
  "religion": "ISLAM"
}
```

8. Update Nationality
* PATCH `/api/v1/smps/user_patch/update_nationality`
JSON:
```json
{
  "user_id": "USER_UUID",
  "nationality": "Bangladeshi"
}
```

9. Update Birth Certificate Number
* PATCH `/api/v1/smps/user_patch/update_birth_certificate_number`
JSON:
```json
{
  "user_id": "USER_UUID",
  "birth_certificate_number": "12345678901234567"
}
```

10. Update NID Number
* PATCH `/api/v1/smps/user_patch/update_nid_number`
JSON:
```json
{
  "user_id": "USER_UUID",
  "nid_number": "1234567890"
}
```

11. Update Photo URL
* PATCH `/api/v1/smps/user_patch/update_photo_url`
JSON:
```json
{
  "user_id": "USER_UUID",
  "photo_url": "https://example.com/profile.jpg"
}
```

### User Delete Routes

> Delete routes only clear the selected field by setting its value to `null`.
> The User record itself is not deleted.

1. Delete Blood Group
* DELETE `/api/v1/smps/user_delete/delete_blood_group`
JSON:
```json
{
  "user_id": "USER_UUID"
}
```

2. Delete Date of Birth
* DELETE `/api/v1/smps/user_delete/delete_date_of_birth`
JSON:
```json
{
  "user_id": "USER_UUID"
}
```

3. Delete Height
* DELETE `/api/v1/smps/user_delete/delete_height_in_cm`
JSON:
```json
{
  "user_id": "USER_UUID"
}
```

4. Delete Weight
* DELETE `/api/v1/smps/user_delete/delete_weight_in_kg`
JSON:

```json
{
  "user_id": "USER_UUID"
}
```

5. Delete Religion
* DELETE `/api/v1/smps/user_delete/delete_religion`
JSON:
```json
{
  "user_id": "USER_UUID"
}
```

6. Delete Birth Certificate Number
* DELETE `/api/v1/smps/user_delete/delete_birth_certificate_number`
JSON:
```json
{
  "user_id": "USER_UUID"
}
```

7. Delete NID Number
* DELETE `/api/v1/smps/user_delete/delete_nid_number`
JSON:
```json
{
  "user_id": "USER_UUID"
}
```

8. Delete Photo URL
* DELETE `/api/v1/smps/user_delete/delete_photo_url`
JSON:
```json
{
  "user_id": "USER_UUID"
}
```

```
**Note:** For `blood_group` and `religion`, I used example enum values. Replace `A_POSITIVE` / `ISLAM` with the exact enum members from your Prisma schema if they differ.
```

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


### Spouse Information

* POST /api/v1/smps/spouse_information/create

JSON: {

  "user_id": "USER_UUID",
  "full_name": "USER SPOUSE FULL NAME",
  "contact_no": "USER SPOUSE CONTACT NUMBER",
  "father_name": "USER SPOUSE FATHER NAME",
  "father_contact_no": "USER SPOUSE FATHER CONTACT NUMBER",
  "mother_name": "USER SPOUSE MOTHER NAME",
  "mother_contact_no": "USER SPOUSE MOTHER CONTACT NUMBER",
  "occupation": "USER SPOUSE OCCUPATION",
  "job_title": "USER SPOUSE JOB TITLE",
  "monthly_income": "USER SPOUSE MONTHLY INCOME",
  "present_address": {
    "house_no": "HOUSE NUMBER",
    "house_name": "HOUSE NAME",
    "plot_no": "PLOT NUMBER",
    "road_no": "ROAD NUMBER",
    "neighbourhood": "NEIGHBOURHOOD",
    "region": "REGION",
    "village": "VILLAGE",
    "post_code": 1234,
    "post_office": "POST OFFICE",
    "thana": "THANA",
    "district": "DISTRICT",
    "country": "Bangladesh"
  },

  "permanent_address": {
    "house_no": "HOUSE NUMBER",
    "house_name": "HOUSE NAME",
    "plot_no": "PLOT NUMBER",
    "road_no": "ROAD NUMBER",
    "neighbourhood": "NEIGHBOURHOOD",
    "region": "REGION",
    "village": "VILLAGE",
    "post_code": 1234,
    "post_office": "POST OFFICE",
    "thana": "THANA",
    "district": "DISTRICT",
    "country": "Bangladesh"
  }

  }

------> Only `user_id` and `full_name` are required here. All other spouse fields are optional. `present_address` and `permanent_address` are also optional. See the Zod schema to get the full requirement.

* DELETE /api/v1/smps/spouse_information/delete
  JSON: {
    "user_id": "USER_UUID"
  }
------> This deletes the complete spouse information of the specified user, including the connected present and permanent addresses.

* PATCH /api/v1/smps/spouse_information/update_full_name
  JSON: {
  "user_id": "USER_UUID",
  "full_name": "USER SPOUSE FULL NAME"
  }

* PATCH /api/v1/smps/spouse_information/update_contact_no
  JSON: {
  "user_id": "USER_UUID",
  "contact_no": "USER SPOUSE CONTACT NUMBER"
  }

------> `contact_no` can be set to `null` when clearing the value.

* PATCH /api/v1/smps/spouse_information/update_father_name
  JSON: {
  "user_id": "USER_UUID",
  "father_name": "USER SPOUSE FATHER NAME"
  }

* PATCH /api/v1/smps/spouse_information/update_father_contact_no
  JSON: {
  "user_id": "USER_UUID",
  "father_contact_no": "USER SPOUSE FATHER CONTACT NUMBER"
  }

* PATCH /api/v1/smps/spouse_information/update_mother_name
  JSON: {
  "user_id": "USER_UUID",
  "mother_name": "USER SPOUSE MOTHER NAME"
  }

* PATCH /api/v1/smps/spouse_information/update_mother_contact_no
  JSON: {
  "user_id": "USER_UUID",
  "mother_contact_no": "USER SPOUSE MOTHER CONTACT NUMBER"
  }

* PATCH /api/v1/smps/spouse_information/update_occupation
  JSON: {
  "user_id": "USER_UUID",
  "occupation": "USER SPOUSE OCCUPATION"
  }

* PATCH /api/v1/smps/spouse_information/update_job_title
  JSON: {
  "user_id": "USER_UUID",
  "job_title": "USER SPOUSE JOB TITLE"
  }

* PATCH /api/v1/smps/spouse_information/update_monthly_income
  JSON: {
  "user_id": "USER_UUID",
  "monthly_income": "USER SPOUSE MONTHLY INCOME"
  }

------> The PATCH endpoints for nullable fields accept `null` when you want to clear the existing value.

* DELETE /api/v1/smps/spouse_information/delete_contact_no
  JSON: {
  "user_id": "USER_UUID"
  }

* DELETE /api/v1/smps/spouse_information/delete_father_name
  JSON: {
  "user_id": "USER_UUID"
  }

* DELETE /api/v1/smps/spouse_information/delete_father_contact_no
  JSON: {
  "user_id": "USER_UUID"
  }

* DELETE /api/v1/smps/spouse_information/delete_mother_name
  JSON: {
  "user_id": "USER_UUID"
  }

* DELETE /api/v1/smps/spouse_information/delete_mother_contact_no
  JSON: {
  "user_id": "USER_UUID"
  }

* DELETE /api/v1/smps/spouse_information/delete_occupation
  JSON: {
  "user_id": "USER_UUID"
  }

* DELETE /api/v1/smps/spouse_information/delete_job_title
  JSON: {
  "user_id": "USER_UUID"
  }

* DELETE /api/v1/smps/spouse_information/delete_monthly_income
  JSON: {
  "user_id": "USER_UUID"
  }

------> The field DELETE endpoints set the selected optional field to `null`. There is no `delete_full_name` endpoint because `full_name` is required.
