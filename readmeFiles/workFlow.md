## REGISTRATION:
* Only SUPER_ADMIN and  ADMIN and TEACHER_ADMIN can create different USER like STUDENT, MANAGEMENT_STAFF,  ACADEMIC_STAFF, GOVERNING_BODY. No public registration.
* After successful registration, an email will send to created user for email verify otp code with 5 minutes life time.
* After successful email verification, a random password will create and will send to created user by email. 
* With that password, created user can login and can change the password.

## CHANGE PASSWORD:
* First user will login. 
* Then user will click on change password.
* Then user will send some information like: auto filled full_name, auto filled 11 digit mobile number, current_passowrd, new_password, confirm_password.
* new_password and confirm_password should be same.
* if current_password matches with the database stored password, a new random password will create and update to database and send to user email. 

## FORGET PASSWORD:
* As user already forgot the password, so user will not be able to login.
* User will click on the forget password option. Email will ask to user. User will send email.
* An OTP with 5 minutes life time will send to user email. 
* User will verify email with that OTP .
* After successful email verification, a random password will create and update to database and send to user email.