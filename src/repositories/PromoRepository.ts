import Promo, { IPromo } from '../models/Promo';
import BaseRepository from '../classes/BaseRepository';
import type { Document } from "mongoose";

class PromoRepository extends BaseRepository<IPromo> {
    constructor() {
        super(Promo); 
    }

    // Add specific methods for PromoRepository here
    async findByCode(code: string): Promise<IPromo | null> {
        return this.model.findOne({ 
            code: code.toUpperCase() 
        });
    }
}

export default PromoRepository;