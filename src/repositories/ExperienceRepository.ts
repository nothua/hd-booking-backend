import Experience, { IExperience } from '../models/Experience';
import BaseRepository from '../classes/BaseRepository';
import type { Document } from "mongoose";

class ExperienceRepository extends BaseRepository<IExperience> {
    constructor() {
        super(Experience); 
    }

    // Add specific methods for ExperienceRepository here
    async searchByName(query: string): Promise<(IExperience & Document)[]> {
        if (!query || query.trim() === "") {
        return this.model.find(); 
        }

        return this.model.find({
            name: { $regex: query, $options: "i" } 
        });
    }
}

export default ExperienceRepository;