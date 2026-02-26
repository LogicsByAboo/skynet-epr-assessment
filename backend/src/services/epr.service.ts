import db from "../db";

export async function getEprsByPerson(personId: string) {
  return db("epr_records")
    .where("person_id", personId)
    .orderBy("period_start", "desc");
}

export async function getEprById(id: string) {
  return db("epr_records as e")
    .join("users as u", "e.person_id", "u.id")
    .select(
      "e.*",
      "u.name as person_name"
    )
    .where("e.id", id)
    .first();
}

export async function createEpr(data: {
    personId: string;
    evaluatorId: string;
    roleType: "student" | "instructor";
    periodStart: string;
    periodEnd: string;
    overallRating: number;
    technicalSkillsRating: number;
    nonTechnicalSkillsRating: number;
    remarks: string;
    status: "draft" | "submitted" | "archived";
  }) {
    const [record] = await db("epr_records")
      .insert({
        person_id: data.personId,
        evaluator_id: data.evaluatorId,
        role_type: data.roleType,
        period_start: data.periodStart,
        period_end: data.periodEnd,
        overall_rating: data.overallRating,
        technical_skills_rating: data.technicalSkillsRating,
        non_technical_skills_rating: data.nonTechnicalSkillsRating,
        remarks: data.remarks,
        status: data.status,
      })
      .returning("*");
  
    return record;
  }

  export async function updateEpr(
    id: string,
    updates: {
      overallRating?: number;
      technicalSkillsRating?: number;
      nonTechnicalSkillsRating?: number;
      remarks?: string;
      status?: "draft" | "submitted" | "archived";
    }
  ) 
  
  {
    const [record] = await db("epr_records")
      .where("id", id)
      .update(
        {
          overall_rating: updates.overallRating,
          technical_skills_rating: updates.technicalSkillsRating,
          non_technical_skills_rating: updates.nonTechnicalSkillsRating,
          remarks: updates.remarks,
          status: updates.status,
          updated_at: db.fn.now(),
        },
        ["*"]
      );
  
    return record;
  }

  export async function getEprsByPersonAndEvaluator(
    personId: string,
    evaluatorId: string
  ) {
    return db("epr_records")
      .where({
        person_id: personId,
        evaluator_id: evaluatorId,
      })
      .orderBy("period_start", "desc");
  }