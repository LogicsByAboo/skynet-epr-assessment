import { Request, Response } from "express";
import * as eprService from "../services/epr.service";

export async function getEprsController(req: Request, res: Response) {
  try {
    const { personId } = req.query;

    if (!personId || typeof personId !== "string") {
      return res.status(400).json({ error: "personId is required" });
    }

    if (!req.currentUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const currentUser = req.currentUser;

    if (
      currentUser.role === "student" &&
      personId !== currentUser.id
    ) {
      return res.status(403).json({
        error: "Access denied",
        message: "Students can only view their own EPRs",
      });
    }

    let records;

    if (currentUser.role === "admin") {
      records = await eprService.getEprsByPerson(personId);
    }

    else if (currentUser.role === "instructor") {
      records = await eprService.getEprsByPersonAndEvaluator(
        personId,
        currentUser.id
      );
    }

    else {
      records = await eprService.getEprsByPerson(personId);
    }

    return res.json(records);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch EPRs" });
  }
}



export async function getEprDetailController(
    req: Request,
    res: Response
  ) {
    try {
      const idParam = req.params.id;
  
      
      if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ error: "Invalid id parameter" });
      }
  
      const record = await eprService.getEprById(idParam);
  
      if (!record) {
        return res.status(404).json({ error: "EPR not found" });
      }
  
      return res.json(record);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Failed to fetch EPR detail" });
    }
  }

  export async function createEprController(req: Request, res: Response) {
    try {
      if (!req.currentUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      if (req.currentUser.role === "student") {
        return res.status(403).json({
            error: "Access denied",
            message: "Students are not permitted to create EPRs" });
      }
  
      const {
        personId,
        roleType,
        periodStart,
        periodEnd,
        overallRating,
        technicalSkillsRating,
        nonTechnicalSkillsRating,
        remarks,
        status
      } = req.body;
  
      if (!personId || !periodStart || !periodEnd) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      if (
        overallRating < 1 || overallRating > 5 ||
        technicalSkillsRating < 1 || technicalSkillsRating > 5 ||
        nonTechnicalSkillsRating < 1 || nonTechnicalSkillsRating > 5
      ) {
        return res.status(400).json({ error: "Ratings must be between 1 and 5" });
      }
  
      if (new Date(periodEnd) < new Date(periodStart)) {
        return res.status(400).json({ error: "periodEnd must be >= periodStart" });
      }
  
      const record = await eprService.createEpr({
        personId,
        evaluatorId: req.currentUser.id, // 🔒 forced
        roleType,
        periodStart,
        periodEnd,
        overallRating,
        technicalSkillsRating,
        nonTechnicalSkillsRating,
        remarks,
        status
      });
  
      return res.status(201).json(record);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create EPR" });
    }
  }

  export async function updateEprController(
    req: Request,
    res: Response
  ) {
    try {
      if (!req.currentUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const currentUser = req.currentUser;
  
      
      const idParam = req.params.id;
  
      if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ error: "Invalid id parameter" });
      }
  
      const id = idParam;
  
      const epr = await eprService.getEprById(id);

      if (!epr) {
        return res.status(404).json({ error: "EPR not found" });
      }
      
      if (epr.status === "submitted" || epr.status === "archived") {
        return res.status(403).json({
          error: "This EPR is locked and cannot be edited"
        });
      }
  
      if (currentUser.role === "student") {
        return res.status(403).json({
          error: "Students cannot edit EPRs",
        });
      }
  
      if (
        currentUser.role === "instructor" &&
        epr.evaluator_id !== currentUser.id
      ) {
        return res.status(403).json({
          error: "You can only edit EPRs you created",
        });
      }

      const updated = await eprService.updateEpr(id, req.body);
  
      return res.json(updated);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Failed to update EPR",
      });
    }
  }

  export async function assistEprController(req: Request, res: Response) {
    try {
      const {
        overallRating,
        technicalSkillsRating,
        nonTechnicalSkillsRating,
      } = req.body;
  
      if (
        !overallRating ||
        !technicalSkillsRating ||
        !nonTechnicalSkillsRating
      ) {
        return res.status(400).json({
          error: "All ratings are required",
        });
      }
  
      let remark = "";
  
      if (overallRating >= 4) {
        remark +=
          "The individual demonstrates strong overall performance during this evaluation period. ";
      } else if (overallRating <= 2) {
        remark +=
          "The individual requires significant improvement in overall performance. ";
      }
  
      if (technicalSkillsRating >= 4) {
        remark +=
          "Technical proficiency is solid with good adherence to procedures and standards. ";
      } else {
        remark +=
          "Technical skills need further refinement and consistent procedural discipline. ";
      }
  
      if (nonTechnicalSkillsRating >= 4) {
        remark +=
          "Non-technical skills such as communication and CRM are commendable. ";
      } else {
        remark +=
          "Greater focus on communication, teamwork, and situational awareness is recommended. ";
      }
  
      return res.json({
        suggestedRemarks: remark,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to generate suggestion",
      });
    }
  }