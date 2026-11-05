## Teacher honourable responsibilities:
* A teacher may have some honourable responsibilities like SUBJECT_TEACHER, RESPONSIBLE_TEACHER, GRADE_TEACHER, GROUP_TEACHER
* A teacher who will assign as a SUBJECT_TEACHER, will assign not for a single class rather will assign for the whole school for that subject.
* A teacher will assign as a RESPONSIBLE_TEACHER for maximum 10 students.
* GROUP_TEACHER for PLAYGROUP AND NURSERY
* GRADE_TEACHER for other classes.
* GRADE_TEACHER or GROUP_TEACHER are like class teachers.
* if a teacher is assign for GRADE_TEACHER for a class, then he/she will not assign as GRADE_TEACHER or GROUP_TEACHER for any other class. uniquely assign.
* if a teacher is assign for GROUP_TEACHER for a class, then he/she will not assign as GRADE_TEACHER or GROUP_TEACHER for any other class. uniquely assign.
* A teacher may assign as SUBJECT_TEACHER, RESPONSIBLE_TEACHER and GROUP_TEACHER at a time.
* A teacher may assign as SUBJECT_TEACHER, RESPONSIBLE_TEACHER and GRADE_TEACHER at a time.
* A teacher will NOT assign as SUBJECT_TEACHER, RESPONSIBLE_TEACHER and GRADE_TEACHER and GROUP_TEACHER at a time.

## Class routine:
- Normal rule:
* A teacher will not be able to take two class in a single period.
* A routine may represent a combined session with multiple classes, teachers, regular subjects, and Quranic subjects.
* A class will not have overlapping routines in the same shift. Teacher overlap is checked across shifts.
* Each student will be able to see their own class routine.
* Each teacher will be able to see their own class routine.
* Each GRADE and GROUP teacher will be able to see the specific class's class routine which class's GRADE TEACHER or GROUP TEACHER he/she is.
* ADMIN and SUPER_ADMIN can see any class's class routine and any teacher's class routine.

## Responsible teacher:
1. A student will only have one responsible teacher at a time.
2. A teacher will have more than one responsible teacher at a time.
3. Principal sir will decide, how many students' responsibility a teacher will take. Primarily, a teacher can take upto 10(ten) students' responsibility.

## Subject Teacher:
* One teacher can assign as Subject Teacher for only one Subject.
* One subject can assign to one or more Subject Teacher.
* Example: We consider subject English. and Three teachers Sumon, Karim, Rahim. Sumon is assigned as Subject Teacher for English. So Sumon will not assign for any more subject. He is now restricted to assign for any subject. On the other hand, English can be assigned to Karim and English can be assigned to Rahim as well. After assigning English to Karim and Rahim. They are now restricted to assign any subject further.

## QURAN: HIFZ, NAZERA AND NURANI
* The Grade teacher for GRADE_HIFZ can see the other Quranic teachers. 
* All the quranic teachers are assigned as Subject Teacher of QURAN subject.
* So Grade teacher of GRADE_HIFZ will be able to see all the teacher's class routine who are assign as Subject Teacher of QURAN.

## QURANIC SUBJECTS:
* A student must take one QURANIC SUBJECT from all QURANIC SUBJECTS. And only quranic subject can take not more than one.
* A student can take ARABIC SUBJECT optional.

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

## MANAGEMENT STAFF CREATION 
- Creating management staff is a part of creating user. 
- When a user will create, the person should be a management staff or academic staff or governing body or student.
- If the person is a management staff then first user will create and then management staff will create.

## ACADEMIC STAFF CREATION 
- Creating academic staff is a part of creating user. 
- When a user will create, the person should be a management staff or academic staff or governing body or student.
- If the person is a academic staff then first user will create and then academic staff will create.

## GOVERNING BODY CREATION 
- Creating governing body is a part of creating user. 
- When a user will create, the person should be a management staff or academic staff or governing body or student.
- If the person is a governing body then first user will create and then governing body will create.

## STUDENT CREATION (NEW ADMISSION model User, model Student and model ClassHistory and model)
- Creating student is a part of creating user. 
- When a user will create, the person should be a management staff or academic staff or governing body or student.
- If the person is a student then first user will create and then student will create.
- For new students, user profile will create and he has to pay both admission fee and session fee.

## STUDENT READMISSION (model Student and model ClassHistory)
- Suppose, A student is going for readmission. 
- The main readmission condition is the student have to continue. The student have to be a student of the previous year of his readmission academic year.
- Student will only pay session fee for the readmission.
- He will readmit at November'26 and now at Grade One. 
- He will readmit for Grade Two AT ACADEMIC YEAR 2027. 
- When his readmission will create, it should check that the student was admitted in 2026 with his class history. if yes then Grade Two ClassHistory will open. 
- Grade One admission ClassHistory will receive an end_date at 31st December 2026. and Grade Two readmission will receive a start_date at 1st Jan'27. 
- But the readmission entry date is suppose 3rd Nov'26. 
- So after entry the active_class of Student model will not change. 
- Rather it will change with the willings of Super admin and a route has created to inactive the not readmitted students.


## OLD STUDENT ADMISSION 
- For old student, if the student is not admit to the previous year of the target admission academic year, the student does not need to create user profile. The student has already the user profile.
- Suppose a student is going to admit at academic year 2027.
- The student was admited before. But he was not a student of this institute in academic year 2026. 
- At this situation, he will have to pay both admission fee and session fee.