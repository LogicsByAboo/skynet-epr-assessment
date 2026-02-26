import { Request, Response } from "express";
import * as peopleService from "../services/people.service";

export async function getPeopleController(req: Request, res: Response) {
  try {
    const { role, search } = req.query;

    const data = await peopleService.getPeople(
      role as string | undefined,
      search as string | undefined
    );

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch people" });
  }
}