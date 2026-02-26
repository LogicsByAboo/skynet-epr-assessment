import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Clear in FK order
  await knex("epr_records").del();
  await knex("enrollments").del();
  await knex("courses").del();
  await knex("users").del();

  // ================= USERS =================

  const instructors = await knex("users")
    .insert([
      { name: "Capt. Arjun Mehta", email: "arjun@academy.com", role: "instructor" },
      { name: "Capt. Riya Sharma", email: "riya@academy.com", role: "instructor" },
      { name: "Admin User", email: "admin@academy.com", role: "admin" },
    ])
    .returning("*");

  const students = await knex("users")
    .insert([
      { name: "Rahul Verma", email: "rahul@academy.com", role: "student" },
      { name: "Aman Singh", email: "aman@academy.com", role: "student" },
      { name: "Priya Nair", email: "priya@academy.com", role: "student" },
      { name: "Karan Patel", email: "karan@academy.com", role: "student" },
      { name: "Neha Joshi", email: "neha@academy.com", role: "student" },
      { name: "Rohit Das", email: "rohit@academy.com", role: "student" },
    ])
    .returning("*");

  // ================= COURSES =================

  const courses = await knex("courses")
    .insert([
      {
        name: "CPL Integrated",
        license_type: "CPL",
        total_required_hours: 200,
      },
      {
        name: "Private Pilot License",
        license_type: "PPL",
        total_required_hours: 45,
      },
    ])
    .returning("*");

  // ================= ENROLLMENTS =================

  const enrollments = await knex("enrollments")
    .insert([
      {
        student_id: students[0].id,
        course_id: courses[0].id,
        start_date: "2024-01-10",
        status: "active",
      },
      {
        student_id: students[1].id,
        course_id: courses[0].id,
        start_date: "2024-02-01",
        status: "active",
      },
      {
        student_id: students[2].id,
        course_id: courses[1].id,
        start_date: "2024-03-15",
        status: "completed",
      },
    ])
    .returning("*");

  // ================= EPR RECORDS =================

  await knex("epr_records").insert([
    {
      person_id: students[0].id,
      evaluator_id: instructors[0].id,
      role_type: "student",
      period_start: "2024-01-01",
      period_end: "2024-03-31",
      overall_rating: 4,
      technical_skills_rating: 4,
      non_technical_skills_rating: 5,
      remarks: "Strong technical performance. Good CRM discipline.",
      status: "submitted",
    },
    {
      person_id: students[1].id,
      evaluator_id: instructors[1].id,
      role_type: "student",
      period_start: "2024-01-01",
      period_end: "2024-03-31",
      overall_rating: 3,
      technical_skills_rating: 3,
      non_technical_skills_rating: 4,
      remarks: "Progressing well. Needs checklist consistency.",
      status: "draft",
    },
    {
      person_id: instructors[0].id,
      evaluator_id: instructors[1].id,
      role_type: "instructor",
      period_start: "2024-01-01",
      period_end: "2024-06-30",
      overall_rating: 5,
      technical_skills_rating: 5,
      non_technical_skills_rating: 4,
      remarks: "Excellent leadership and mentoring skills.",
      status: "submitted",
    },
  ]);
}