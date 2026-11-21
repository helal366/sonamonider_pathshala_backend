I found two remaining correctness issues in the reviewed workflows:

Medium — duplicate admission can slip through concurrent requests. Readmission checks for an existing student/year enrollment before creating history, but the database schema has no uniqueness constraint on (student_id, academic_year_id). Two concurrent readmission requests can both pass the check and create separate history records if their class/roll details differ. Old-student admission has the same risk, and its history checks happen before its transaction. See student.service.ts, oldStudentAdmission, and classHistory.prisma. A database constraint or equivalent concurrency-safe enforcement would prevent this.

Medium — student username generation can conflict across roles. Usernames are globally unique, but the count used to generate them is scoped to the requested role. If a student shares a mobile number with an existing user of another role, the student count can be zero and the service will try to use the same mobile number as that user’s username. See userCreation.service.ts, userCount, and user.prisma.

\*\*\* Create user staff
{
"full_name": "Asma Akter",
"mobile_number": "01322035427",
"gender": "FEMALE",
"email": "asmaakter26696@gmail.com",
"position_name": "ACADEMIC_STAFF",
"role_name": "ACADEMIC",
"joining_date": "2025-07-31T00:00:00.000Z"
}

\*\*\* Create user student
{
"full_name": "Ibrahim Abdullah",
"mobile_number": "01723564946",
"gender": "MALE",
"email": "fais23635@gmail.com",
"position_name": "STUDENT",
"role_name": "STUDENT",
"joining_date": "2026-01-01",
"active_class_id":"9f418e8d-5f56-4244-83dd-a4fe9ee8492b",
"academic_year_name":"2026",
"roll_number": 1,
"shift_name": "MORNING",
"section":"MADRASHA",
"version":"ENGLISH",
"department": "GENERAL",
"quranic_subject_name":"NURANI_AMMAPARA",
"quranic_period_ids": ["75d13d6f-e3cb-434b-a160-2f6fffaf36bf", "7fcfa5fb-8c3e-4728-97e0-431ae888cd1c"],
"arabic_subject_names": ["ARABIC"],
"arabic_period_ids": ["5a7aa0ba-96c4-4d2d-a721-e87ba9a3a230"]
}

\*\*\* login
{
"user_name": "01511556616",
"user_password": "123456"
}

\*\*\* verify email
{
"email": "asmaakter26696@gmail.com",
"otp": "318452"
}

*\*\* change password
{
"current_password": "*C3Trq",
"new_password": "123456",
"confirm_password": "123456"
}

\*\*\* Create promotion request
{
"user_id": "46ba13ef-1185-4ee1-a5f8-1cedf4499b92",
"old_position": "ACADEMIC_STAFF",
"new_position": "ASSISTANT_TEACHER",
"old_role": "ACADEMIC",
"new_role": "ACADEMIC"
}

\*\*\*\* action promotion request
{
"action_status": "APPROVED",
"effective_date": "2026-10-27T00:00:00.000Z"
}

---

i have updated the zod and route file of coCurricularActivitiesMark module. the change is #sym:co_curricular_activities_id instead of id. now check the other files , controller and service layer. do i need to use #sym:co_curricular_activities_id word in controller ? here i see req: Request<{ id: string }> and the file is not showing any error.
