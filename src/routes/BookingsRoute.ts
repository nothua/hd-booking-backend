import type { Request, Response } from "express";
import ExperienceRepository from "../repositories/ExperienceRepository";
import SlotRepository from "../repositories/SlotRepository";
import BookingRepository from "../repositories/BookingRepository";
import PromoRepository from "../repositories/PromoRepository";

import { startSession, Types } from "mongoose";
import { IBooking } from '../models/Booking';
import { IPromo } from '../models/Promo';
import { calculateDiscount, calculatePricing } from "../utils";

const expRepo = new ExperienceRepository();
const slotRepo = new SlotRepository();
const bookingRepo = new BookingRepository();
const promoRepo = new PromoRepository();

const router = require("express").Router();


router.post("/", async(req: Request, res: Response) => {
  
  const session = await startSession();
  let createdBooking: IBooking | null = null;

  try {
    await session.withTransaction(async () => {
      const {
        fullName,
        email,
        phone,
        experienceId,
        slotId,
        quantity,
        promoCode
      } = req.body;

      const numQuantity = parseInt(quantity, 10);
      if (!fullName || !email || !experienceId || !slotId || !quantity || numQuantity <= 0) {
        throw new Error('Missing or invalid required booking fields.');
      }
      if (!Types.ObjectId.isValid(experienceId) || !Types.ObjectId.isValid(slotId)) {
          throw new Error('Invalid ID format');
      }

      const experience = await expRepo.get(experienceId, session);
      const slot = await slotRepo.get(slotId, session);

      if (!experience) {
        return res.status(404).json({ message: 'Experience not found.' });
      }
      if (!slot) {
        return res.status(404).json({ message: 'Slot not found.' });
      }
      if (String(slot.experienceId) !== String(experience._id)) {
        throw new Error('This slot does not belong to the selected experience.');
      }
      if (slot.available < numQuantity) {
        throw new Error(`Not enough spots available. Only ${slot.available} left.`);
      }

      const subtotal = experience.price * numQuantity;
      let validPromo = null;

      if (promoCode) {
        const promo = await promoRepo.findByCode(promoCode);

        if (promo && promo.isActive) {
            validPromo = promo; 
        } else {
            throw new Error('Invalid or expired promo code.');
        }
      }

      const { discount, taxes, total } = calculatePricing(subtotal, validPromo);

      slot.booked += numQuantity;
      await slot.save({ session }); 

      const bookingPayload: Partial<IBooking> = {
        fullName, email, phone,
        experienceId: experienceId, 
        slotId: slotId,
        date: slot.date,
        time: slot.time,
        quantity: numQuantity,
        subtotal,
        taxes,   
        discount,
        promoCode: validPromo ? validPromo.code : null,
        total: parseFloat(total.toFixed(2)),
      };
      
      createdBooking = await bookingRepo.create(bookingPayload, session);
    });

    if (createdBooking) {
        return res.status(201).json(createdBooking);
    } else {
        if (!res.headersSent) {
            console.error('Booking transaction completed, but no booking was created and no error was thrown.');
            return res.status(500).json({ message: 'Booking failed for an unknown reason.' });
        }
    }

  } catch (error: any) {
    console.error('Booking transaction failed:', error);

    if (error.message.includes('Missing') || error.message.includes('Invalid') || error.message.includes('Not enough spots') || error.message.includes('promo code')) {
      return res.status(400).json({ message: error.message });
    }
    if (res.headersSent) {
      return;
    }
    return res.status(500).json({ message: 'Booking failed. Please try again.' });
  } finally {
    await session.endSession();
  }

})

export default router;
