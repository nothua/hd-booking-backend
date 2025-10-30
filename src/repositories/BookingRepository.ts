import Booking, { IBooking } from '../models/Booking';
import BaseRepository from '../classes/BaseRepository';
import type { Document } from "mongoose";

class BookingRepository extends BaseRepository<IBooking> {
    constructor() {
        super(Booking); 
    }

    // Add specific methods for BookingRepository here
}

export default BookingRepository;