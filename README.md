Skynet EPR – Backend Technical Assessment
Overview

This project implements an Employee Performance Review (EPR) system as part of the Backend Intern Technical Assessment.

The system includes relational database design, role-based access control, lifecycle enforcement for EPR records, and an AI-assisted remarks generation endpoint.

What Is Implemented
Level 1

PostgreSQL schema using Knex migrations

Tables:

Users

Courses

Enrollments

EPR Records

Proper foreign key constraints with cascade rules

CRUD APIs for EPR records

Validation for required fields

EPR lifecycle management:

draft → submitted → archived

Submitted and archived EPRs are locked from edits

Filtering and search functionality

Seed data for initial records

Level 2 (Implemented Options)

Role-based access control:

Student: read-only access to own EPRs

Instructor: create and edit their own EPRs (subject to status rules)

Admin: full access

AI-assisted remarks generation endpoint:

POST /api/epr/assist

Generates performance remarks based on rating inputs

Tech Stack

Backend:

Node.js

Express

TypeScript

Knex

PostgreSQL (Neon)

Frontend:

React (Vite)

TypeScript

Tailwind CSS

Project Structure
apps/
  backend/
    migrations/
    seeds/
    src/
  frontend/
Setup Instructions
1. Install Dependencies

From the project root:

Using pnpm:

pnpm install

Using npm:

npm install
Database Setup (PostgreSQL – Neon)

This project uses PostgreSQL hosted on Neon.

Step 1: Create Database

Create an account at https://neon.tech

Create a new project

Copy your Neon PostgreSQL connection string

Step 2: Configure Environment Variables

Create a .env file inside:

apps/backend

Add:

DATABASE_URL=your_neon_connection_string
PORT=5000

Do not commit the .env file.

Step 3: Run Migrations

From:

apps/backend

Using pnpm:

pnpm knex migrate:latest

Using npm:

npx knex migrate:latest
Step 4: Seed Database

From:

apps/backend

Using pnpm:

pnpm knex seed:run

Using npm:

npx knex seed:run

This will populate sample users and EPR records.

Running the Application
Backend

From:

apps/backend

Using pnpm:

pnpm dev

Using npm:

npm run dev

Backend runs at:

http://localhost:5000
Frontend

From:

apps/frontend

Using pnpm:

pnpm dev

Using npm:

npm run dev

Frontend runs at:

http://localhost:5173
Mock Authentication

The backend uses header-based mock authentication:

x-user-id
x-user-role

Supported roles:

admin

instructor

student

How I Used AI in This Project

AI tools were used selectively during development as an auxiliary aid rather than as a primary implementation mechanism.

AI assistance was used for:

Exploring alternative approaches for role-based access control design

Reviewing lifecycle validation logic for edge cases

Refining error handling patterns in controller methods

Drafting and restructuring parts of the documentation for clarity

Brainstorming improvements for the AI-assisted remarks feature

All core implementation decisions, database schema design, migration structure, API development, validation rules, and frontend integration were implemented and verified manually.

AI was primarily used as a productivity support tool for review, refinement, and validation rather than as a source of direct code generation.

Before pushing to GitHub:

Ensure .env is not committed

Ensure .gitignore contains:

.env
node_modules
dist
