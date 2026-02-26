import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  // ================= USERS =================
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.enu("role", ["student", "instructor", "admin"]).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // ================= COURSES =================
  await knex.schema.createTable("courses", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name").notNullable();
    table.string("license_type").notNullable();
    table.decimal("total_required_hours", 6, 2).notNullable();
  });

  // ================= ENROLLMENTS =================
  await knex.schema.createTable("enrollments", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table.uuid("student_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.uuid("course_id")
      .notNullable()
      .references("id")
      .inTable("courses")
      .onDelete("CASCADE");

    table.date("start_date").notNullable();

    table.enu("status", ["active", "completed", "dropped"]).notNullable();
  });

  // ================= EPR RECORDS =================
  await knex.schema.createTable("epr_records", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table.uuid("person_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.uuid("evaluator_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.enu("role_type", ["student", "instructor"]).notNullable();

    table.date("period_start").notNullable();
    table.date("period_end").notNullable();

    table.integer("overall_rating").notNullable();
    table.integer("technical_skills_rating").notNullable();
    table.integer("non_technical_skills_rating").notNullable();

    table.text("remarks");

    table.enu("status", ["draft", "submitted", "archived"]).notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["person_id"]);
    table.index(["evaluator_id"]);
    table.index(["period_start", "period_end"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("epr_records");
  await knex.schema.dropTableIfExists("enrollments");
  await knex.schema.dropTableIfExists("courses");
  await knex.schema.dropTableIfExists("users");
}