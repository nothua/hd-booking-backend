import type { Request, Response } from "express";
import ExperienceRepository from "../repositories/ExperienceRepository";
import SlotRepository from "../repositories/SlotRepository";

const expRepo = new ExperienceRepository();
const slotRepo = new SlotRepository();

const router = require("express").Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const searchQuery = (req.query.search as string)?.toLowerCase() || "";
    const experiences = await expRepo.searchByName(searchQuery);

    res.status(200).json(experiences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
});

router.get("/:id", async(req: Request, res: Response) => {
    const experienceId = req.params.id;
    const experience = await expRepo.get(experienceId);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    const slots = await slotRepo.getByExperienceId(experienceId);

    return res.status(200).json({
      ...experience.toObject(),
      slots: slots 
    });

})

export default router;
