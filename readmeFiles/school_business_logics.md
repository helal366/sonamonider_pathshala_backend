## Teacher honourable responsibilities:
* A teacher may have some honourable responsibilities like SUBJECT_TEACHER, RESPONSIBLE_TEACHER, GRADE_TEACHER, GROUP_TEACHER
* A teacher who will assign as a SUBJECT_TEACHER, will assign not for a single class rather will assign for the whole school for that subject.
* A teacher will assign as a RESPONSIBLE_TEACHER for maximum 10 students.
* GRADE_TEACHER for PLAYGROUP AND NURSERY
* GROUP_TEACHER for other classes.
* GRADE_TEACHER or GROUP_TEACHER are like class teachers.
* if a teacher is assign for GRADE_TEACHER for a class, then he/she will not assign as GRADE_TEACHER or GROUP_TEACHER for any other class. uniquely assign.
* if a teacher is assign for GROUP_TEACHER for a class, then he/she will not assign as GRADE_TEACHER or GROUP_TEACHER for any other class. uniquely assign.
* A teacher may assign as SUBJECT_TEACHER, RESPONSIBLE_TEACHER and GROUP_TEACHER at a time.
* A teacher may assign as SUBJECT_TEACHER, RESPONSIBLE_TEACHER and GRADE_TEACHER at a time.
* A teacher will NOT assign as SUBJECT_TEACHER, RESPONSIBLE_TEACHER and GRADE_TEACHER and GROUP_TEACHER at a time.

## Class routine:
- Normal rule:
* A teacher will not be able to take two class in a single period.
* Each student will be able to see their own class routine.
* Each teacher will be able to see their own class routine.
* Each GRADE and GROUP teacher will be able to see the specific class's class routine which class's GRADE TEACHER or GROUP TEACHER he/she is.
* ADMIN and SUPER_ADMIN can see any class's class routine and any teacher's class routine.

## Responsible teacher:
1. A student will only have one responsible teacher at a time.
2. A teacher will have more than one responsible teacher at a time.
3. Principal sir will decide, how many students' responsibility a teacher will take. Primarily, a teacher can take upto 10(ten) students' responsibility.

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


## STUDENT READMISSION (model Student and model ClassHistory)
Suppose, A student is going for readmission. He will readmit at November'26 and now at Grade One. He will readmit for Grade Two. When his readmission will create, the Grade One admission will close with adding a end_date to ClassHistory and Grade Two ClassHistory will open. Grade One admission ClassHistory will receive an end_date at 31st December 2026. and Grade Two readmission will receive a start_date at 1st Jan'27. But the readmission entry date is suppose 3rd Nov'26. So after entry the active_class of Student model will not change. Rather it will change at 1st january 2027.