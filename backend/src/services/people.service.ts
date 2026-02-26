import db from "../db";

export async function getPeople(role?: string, search?: string) {
  const query = db("users as u")
    .select(
      "u.id",
      "u.name",
      "u.email",
      "u.role"
    );

  if (role) {
    query.where("u.role", role);
  }

  if (search) {
    query.andWhere((qb) => {
      qb.whereILike("u.name", `%${search}%`)
        .orWhereILike("u.email", `%${search}%`);
    });
  }

  const users = await query;

  const results = await Promise.all(
    users.map(async (user) => {
      if (user.role === "student") {
        const enrollment = await db("enrollments as e")
          .join("courses as c", "e.course_id", "c.id")
          .select("c.name as course_name", "e.status")
          .where("e.student_id", user.id)
          .first();

        return {
          ...user,
          course_name: enrollment?.course_name || null,
          status: enrollment?.status || null,
        };
      }

      if (user.role === "instructor") {
        const count = await db("epr_records")
          .where("evaluator_id", user.id)
          .count<{ count: string }>("id as count")
          .first();

        return {
          ...user,
          total_eprs_written: Number(count?.count || 0),
        };
      }

      return user;
    })
  );

  return results;
}