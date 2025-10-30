import Slot, { ISlot } from '../models/Slot';
import BaseRepository from '../classes/BaseRepository';
import type { Document } from "mongoose";

class SlotRepository extends BaseRepository<ISlot> {
    constructor() {
        super(Slot); 
    }

    // Add specific methods for SlotRepository here
    
    async getByExperienceId(experienceId: string){
        return this.model.find({ experienceId }).sort({ date: 1, time: 1 });
    }

}

export default SlotRepository;