## ROLES (enum): 
SUPER_ADMIN
TEACHER_ADMIN
ADMIN
MANAGEMENT
ACADEMIC
STUDENT 
GOVERNING_BODY

## POSITIONS:
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

## SECTIONS 
SCHOOL 
MADRASHA

## VERSIONS
BANGLA
ENGLISH


<!-- academic staff role : ACADEMIC, TEACHER_ADMIN -->
<!-- administrative staff role: MANAGEMENT, ADMIN,  SUPER_ADMIN -->
<!-- student role : STUDENT -->
<!-- governing body role: GOVERNING_BODY -->

## CLASSES:
- PLAYGROUP
- NURSERY
- GRADE_ONE
- GRADE_TWO
- GRADE_THREE
- GRADE_FOUR
- GRADE_FIVE
- GRADE_SIX
- GRADE_SEVEN
- GRADE_EIGHT
- GRADE_NINE
- GRADE_TEN
- GRADE_HIFZ
- GRADE_NURANI
- GRADE_NAZERA

## QURANIC SUBJECTS:
- NURANI_PLAYGROUP
- NURANI_NURSERY
- NURANI_PRELIMINARY
- NURANI_AMMAPARA
- NURANI_ADVANCE
- NAZERA_PRELIMINARY
- NAZERA_AMMAPARA
- NAZERA_ADVANCE
- PRE_HIFZ
- HIFZ

## SUBJECTS FOR SUBJECT TEACHER (enum created)
- QURAN
- BENGALI
- ARABIC
- ENGLISH
- MATHEMATICS

## SHIFTS:
- MORNING     For PLAYGROUP, NURSERY, KG, GRADE_ONE, GRADE_TWO
- DAY         For PLAYGROUP, NURSERY, KG, GRADE_ONE, GRADE_TWO
- BOYS        For GRADE_THREE to GRADE_TEN
- GIRLS       For GRADE_THREE to GRADE_TEN

## CONNECTION BETWEEN CLASS AND BRANCH:
PLAYGROUP, NURSERY, KG, GRADE_ONE AND GRADE_TWO---> MORNING and DAY
OTHER CLASSES ---> BOYS and GIRLS

## HONOURABLE RESPONSIBILITIES FOR TEACHERS:
SUBJECT_TEACHER
GROUP_TEACHER
GRADE_TEACHER
RESPONSIBLE_TEACHER

## NURANI CURRICULUM FOR DIFFERENT CLASSES:
NURANI_PLAYGROUP: ARABIC ALPHABET
NURANI_NURSERY: ARABIC WORD MAKING
NURANI_PRELIMINARY: কায়েদা শুরু থেকে মাদ্দ অধ্যায় পর্যন্ত
NURANI_ADVANCE: হরকত অধ্যায় থেকে শেষ পর্যন্ত
NURANI_AMPARA: শুরু থেকে শেষ পর্যন্ত



## QURANIC CLASS PERIODS SCHEDULING/TIMING:
**QURANIC CLASS PERIODS: **
- NURANI_MORNING: 07:01 AM to 07:50 AM
- HIFZ_MORNING: 06:01 AM to 07:50 AM
- ASSEMBLY: 07:51 AM to 08:00 AM

- ARABIC: 10:16 AM to 11:15 AM
- ARABIC_BOYS: 11:16 AM to 12:00 PM
- ARABIC_GIRLS: 09:01 AM to 09:45 AM

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


## STUDENTS FEES:
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

## STAFF SALARY:
- monthly_salary
- eid_bonus [eid_ul_fitr and eid_ul_azha]
- performance_bonus [yearly]
- increment

### Payment records
- Each student has an individual fee rate for each fee type. Rates have effective dates so a rate change does not overwrite the previous rate.
- Each student fee payment records the full amount paid, payment date, fee type, and billing period. Only one payment is allowed for a student, fee type, and billing period; the application should validate the amount against the effective fee rate.
- Use `YYYY-MM` for monthly billing periods, `YYYY-H1` or `YYYY-H2` for half-yearly billing periods, and `YYYY` for yearly billing periods. One-time fees use a stable period key such as `YYYY`.
- Academic and management staff are both linked to their `User` record for salary rates and payments. Record each salary change as a new salary rate with its effective date and mark increments with `INCREMENT`.
- Staff payment records capture the full amount paid and date. Use `YYYY-MM` for monthly salary, `YYYY` for yearly performance bonuses, and a year-based period key for each Eid bonus. The application should validate monthly salary payments against the effective salary rate.

## Extra curriculum activities:

### Cultural club:
* সংগীত
* অভিনয়
* বিতর্ক
* আবৃতি
* বক্তৃতা
* উপস্থাপনা
* art
* দেয়াল লিখন (caligraphy)

### Quran club:
* কেরাত
* after school maktab
* senior citizen quran learning

### Language club:
* Spoken english
* Spoken arabic
* Phoenetics
* Reading (Presentation)
* Cursive writing 
* শুদ্ধ বাংলা উচ্চারণ

### Science club:
* ক্ষুদে বিজ্ঞানী (with project)
* ক্ষুদে ডাক্তার (with project)
* Basic computer learning
* Robotics
* Basic IT with basic AI

### Scout and sports club:
* PT Parade (শারীরিক শিক্ষা কুচকাওয়াজ বা শারীরিক কসরত প্রদর্শনী।)
* Martial arts/Karate
* Swimming

-- AddUniqueConstraintForSingleResponsibleTeacher
CREATE UNIQUE INDEX student_single_active_responsibility_idx 
ON "students_responsibility" ("student_id") 
WHERE "isActive" = true;


pnpm exec prisma validate