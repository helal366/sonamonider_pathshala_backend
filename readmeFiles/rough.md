I found two remaining correctness issues in the reviewed workflows:

Medium — duplicate admission can slip through concurrent requests. Readmission checks for an existing student/year enrollment before creating history, but the database schema has no uniqueness constraint on (student_id, academic_year_id). Two concurrent readmission requests can both pass the check and create separate history records if their class/roll details differ. Old-student admission has the same risk, and its history checks happen before its transaction. See student.service.ts, oldStudentAdmission, and classHistory.prisma. A database constraint or equivalent concurrency-safe enforcement would prevent this.

Medium — student username generation can conflict across roles. Usernames are globally unique, but the count used to generate them is scoped to the requested role. If a student shares a mobile number with an existing user of another role, the student count can be zero and the service will try to use the same mobile number as that user’s username. See userCreation.service.ts, userCount, and user.prisma.


*** Create user staff
{
  "full_name": "Asma Akter",
  "mobile_number": "01322035427",
  "gender": "FEMALE",
  "email": "asmaakter26696@gmail.com",
  "position_name": "ACADEMIC_STAFF",
  "role_name": "ACADEMIC",
  "joining_date": "2025-07-31T00:00:00.000Z"
}

*** Create user student
{
  "full_name": "Asma Akter",
  "mobile_number": "01322035427",
  "gender": "FEMALE",
  "email": "asmaakter26696@gmail.com",
  "position_name": "ACADEMIC_STAFF",
  "role_name": "ACADEMIC",
  "joining_date": "2025-07-31T00:00:00.000Z",
  "class_name":"NURSERY",
  "academic_year":"2026",
  "roll_number": 1,
  "shift": "MORNING",
  "section":"MADRASHA",
  "version":"MORNING",
  "department": null,
}


*** login
{
  "user_name": "01511556616",
  "user_password": "123456"
}

*** verify email
{
  "email": "asmaakter26696@gmail.com",
  "otp": "318452"
}

*** change password
{
  "current_password": "*C3Trq",
  "new_password": "123456",
  "confirm_password": "123456"
}

*** Create promotion request
{
  "user_id": "46ba13ef-1185-4ee1-a5f8-1cedf4499b92",
  "old_position": "ACADEMIC_STAFF",
  "new_position": "ASSISTANT_TEACHER",
  "old_role": "ACADEMIC",
  "new_role": "ACADEMIC"
}

**** action promotion request
{
  "action_status": "APPROVED",
  "effective_date": "2026-10-27T00:00:00.000Z"
}