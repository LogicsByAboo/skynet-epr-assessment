import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        role: "student" | "instructor" | "admin";
      };
    }
  }
}

export function mockAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.header("x-user-id");
  const userRole = req.header("x-user-role");

  if (!userId || !userRole) {
    return res.status(401).json({ error: "Missing mock auth headers" });
  }

  // ✅ Allow admin also
  if (!["student", "instructor", "admin"].includes(userRole)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  req.currentUser = {
    id: userId,
    role: userRole as "student" | "instructor" | "admin",
  };

  next();
}