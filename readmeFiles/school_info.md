## Roles: 
SUPER_ADMIN
TEACHER_ADMIN
ADMIN
MANAGEMENT
ACADEMIC
STUDENT 
GOVERNING_BODY

## Positions:
PRINCIPAL
VICE_PRINCIPAL
ADMINISTRATIVE_INCHARGE
ACADEMIC_INCHARGE
LOGISTIC_OFFICER
ACADEMIC_STAFF
MANAGEMENT_STAFF
TEACHER
ASSISTANT_TEACHER
TEACHER_ASSISTANT
CO-ORDINATOR
ACCOUNTANT
STUDENT
GOVERNING_BODY
SISTER
AAYA
GUARD
CLEANER


<!-- academic staff role : ACADEMIC, TEACHER_ADMIN -->
<!-- administrative staff role: MANAGEMENT, ADMIN,  SUPER_ADMIN -->
<!-- student role : STUDENT -->
<!-- governing body role: GOVERNING_BODY -->

## Classes:
PLAYGROUP
NURSERY
KINDERGARTEN
KINDERGARTEN_DAY
GRADE_ONE_ENGLISH
GRADE_ONE_BANGLA
GRADE_TWO_ENGLISH
GRADE_TWO_BANGLA
GRADE_THREE_BANGLA
GRADE_FOUR_BANGLA
GRADE_FIVE_BANGLA
GRADE_SIX_BANGLA
GRADE_SEVEN_BANGLA
GRADE_EIGHT_BANGLA
GRADE_NINE_BANGLA
GRADE_TEN_BANGLA

## Quranic subjects:
- NURANI_PLAYGROUP
- NURANI_NURSERY
- NURANI_PRELIMINARY
- NURANI_ADVANCE
- NURANI_AMPARA
- NAZERA
- HIFZ

## Shifts:
- MORNING     For PLAYGROUP, NURSERY, KG, 
- DAY         For PLAYGROUP, NURSERY, KG, 
- BOYS        For GRADE_ONE to GRADE_TEN
- GIRLS       For GRADE_ONE to GRADE_TEN

## Connection between Class and Branch:
PLAYGROUP, NURSERY, KG, ---> MORNING and DAY
OTHER CLASSES ---> BOYS and GIRLS

## Honourable responsibilities for teachers:
SUBJECT_TEACHER
GROUP_TEACHER
GRADE_TEACHER
RESPONSIBLE_TEACHER

## Nurani curriculum for different classes:
NURANI_PLAYGROUP: ARABIC ALPHABET
NURANI_NURSERY: ARABIC WORD MAKING
NURANI_PRELIMINARY: কায়েদা শুরু থেকে মাদ্দ অধ্যায় পর্যন্ত
NURANI_ADVANCE: হরকত অধ্যায় থেকে শেষ পর্যন্ত
NURANI_AMPARA: শুরু থেকে শেষ পর্যন্ত



## Quranic Class Periods scheduling/timimg:
**QURANIC CLASS PERIODS: **
- NURANI_MORNING: 07:01 AM to 07:50 AM
- HIFZ_MORNING: 06:01 AM to 07:50 AM
- ASSEMBLY: 07:51 AM to 08:00 AM

- ARABIC_LITERATURE: 10:16 AM to 11:15 AM
- ARABIC_LITERATURE_BOYS: 11:16 AM to 12:00 PM
- ARABIC_LITERATURE_GIRLS: 09:01 AM to 09:45 AM

- QURANIC_EVENING: 03:01 PM to 05:00 PM
- HIFZ_NIGHT: 05:00 PM to 08:00 PM

- NURANI_NAZERA_GIRLS: 09:46 AM to 10:30 AM
- HIFZ_GIRLS: 08:01 AM to 09:00 AM

## **CLASS SCHEDULING/TIMING: **
* PLAYGROUP with MORNING BRANCH: 08:00 to 10:30
* PLAYGROUP with DAY BRANCH: 10:45 AM to 13:00 
* NURSERY with MORNING BRANCH: 
    \- 08:00 to 10:15 and NURANI_MORNING and NURANI_EVENING (optional)--->(Nurani/Ampara)
    \- 08:00 to 10:15 and HIFZ_MORNING and HIFZ_EVENING (optional) and HIFZ_NIGHT(optional) --->(Hifz/Nazera)
    
* NURSERY with DAY BRANCH:
    \- 10:30 to 13:00 (only school)
    \- 10:30 to 13:00 and NURANI_MORNING (optional) and NURANI_EVENING (optional) --->(Nurani/Ampara)
    \- 10:30 to 13:00 and HIFZ_MORNING(optional) and HIFZ_EVENING(optional) and HIFZ_NIGHT(optional) --->(Hifz/Nazera)

* KG, GRADE_ONE, GRADE_TWO with MORNING BRANCH: 
    \- 08:00 to 10:30 and NURANI_MORNING and NURANI_EVENING(optional)--->(Nurani/Ampara)
    \- 08:00 to 10:30 and HIFZ_MORNING and HIFZ_EVENING (optional) and HIFZ_NIGHT(optional) --->(Hifz/Nazera)

* KG, GRADE_ONE, GRADE_TWO with DAY BRANCH:
    \- 09:45 to 13:00 
    \- 09:45 to 13:00 and NURANI_MORNING (optional) and NURANI_EVENING(optional)--->(Nurani/Ampara)
    \- 09:45 to 13:00 and HIFZ_MORNING(optional) and HIFZ_EVENING (optional) and HIFZ_NIGHT(optional) --->(Hifz/Nazera)

* GRADE_THREE, GRADE_FOUR and GRADE_FIVE with BOYS BRANCH: 
    \-  NURANI_MORNING and 08:00 to 11:30 and NURANI_EVENING (optional)--->(Nurani/Ampara)
    \-  HIFZ_MORNING and 08:00 tp 11:30 and HIFZ_EVENING(optional) and HIFZ_NIGHT(optional) --->(Hifz/Nazera)
* GRADE_THREE, GRADE_FOUR and GRADE_FIVE with GIRLS BRANCH:
    \- NURANI_GIRLS and 10:30 to 14:20 and NURANI_EVENING(optional)--->(Nurani/Ampara)
    \- HIFZ_GIRLS and 10:30 to 14:20 and HIFZ_EVENING(optional) and HIFZ_NIGHT(optional) --->(Hifz/Nazera)

* GRADE_SIX to GRADE_TEN with BOYS BRANCH:
    \- NURANI_MORNING and 08:00 to 12:30 and NURANI_EVENING(optional)--->(Nurani/Ampara)
    \- HIFZ_MORNING and 08:00 tp 12:30 and HIFZ_EVENING(optional) and HIFZ_NIGHT(optional) --->(Hifz/Nazera)

* GRADE_SIX to GRADE_TEN with GIRLS BRANCH:
    \- NURANI_GIRLS and 10:30 to 14:50 and NURANI_EVENING (optional)--->(Nurani/Ampara)
    \- HIFZ_GIRLS and 10:30 to 14:20 and HIFZ_EVENING (optional) and HIFZ_NIGHT(optional) --->(Hifz/Nazera)


## Students fees:
- monthly_tuition_fee
- session/admission_fee
- monthly_academic_evaluation_fee
- exam_fee [half_yearly and yearly]
- intensive_care_fee
- registration_form_fill_up_fee
- academic_material_uniform_charge
- extra/co_curriculum_activity_fee
- laboratory/library_charge
- winter_festival_fee
- summer_festival_fee
- book_exerciseBook_fee
- quran_hifz_monthly_fee
- certification_fee
- residential_dayCare_establishment_charge

## Staff salary:
- monthly_salary
- eid_bonus [eid_ul_fitr and eid_ul_adha]
- performance_bonus [yearly]
- increment

### Payment records
- Each student has an individual fee rate for each fee type. Rates have effective dates so a rate change does not overwrite the previous rate.
- Each student fee payment records the full amount paid, payment date, fee type, and billing period. Only one payment is allowed for a student, fee type, and billing period; the application should validate the amount against the effective fee rate.
- Use `YYYY-MM` for monthly billing periods, `YYYY-H1` or `YYYY-H2` for half-yearly billing periods, and `YYYY` for yearly billing periods. One-time fees use a stable period key such as `YYYY`.
- Academic and management staff are both linked to their `User` record for salary rates and payments. Record each salary change as a new salary rate with its effective date and mark increments with `INCREMENT`.
- Staff payment records capture the full amount paid and date. Use `YYYY-MM` for monthly salary, `YYYY` for yearly performance bonuses, and a year-based period key for each Eid bonus. The application should validate monthly salary payments against the effective salary rate.

-- AddUniqueConstraintForSingleResponsibleTeacher
CREATE UNIQUE INDEX student_single_active_responsibility_idx 
ON "students_responsibility" ("student_id") 
WHERE "isActive" = true;


pnpm exec prisma validate