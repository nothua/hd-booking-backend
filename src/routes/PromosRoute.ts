import { Request, Response } from 'express';
import PromoRepository from '../repositories/PromoRepository';
import ExperienceRepository from '../repositories/ExperienceRepository'; 
import { calculateDiscount } from '../utils';

const promoRepo = new PromoRepository();
const expRepo = new ExperienceRepository(); 

const router = require("express").Router();

router.post("/validate", async(req: Request, res: Response) => {
    
    try {
        const { code, experienceId, quantity } = req.body;

        if (!code || !experienceId || !quantity) {
            return res.status(400).json({ message: 'Missing code, experienceId, or quantity' });
        }

        const numQuantity = parseInt(quantity, 10);
        if (numQuantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be positive' });
        }

        const experience = await expRepo.get(experienceId);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        const subtotal = experience.price * numQuantity;

        const promo = await promoRepo.findByCode(code);
        if (!promo) {
            return res.status(404).json({ isValid: false, message: 'Invalid promo code' });
        }

        if (!promo.isActive) {
            return res.status(400).json({ isValid: false, message: 'This promo code is not active' });
        }

        const discountAmount = calculateDiscount(promo, subtotal);
        const total = subtotal - discountAmount;

        return res.status(200).json({
            isValid: true,
            message: 'Promo code applied successfully!',
            subtotal,
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        });

    } catch (error) {
        console.error('Error validating promo code:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

})

export default router;
