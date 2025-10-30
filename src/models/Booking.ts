import { Document, Schema, model, Types } from "mongoose"; 

export interface IBooking extends Document {
	fullName: string;
	email: string;
	phone: string;
	experienceId: Types.ObjectId; 
	slotId: Types.ObjectId;   
	date: Date;
	time: string;
	quantity: number;
	subtotal: number;
	taxes: number;
	discount: number;
	promoCode: string | null;
	total: number;
	bookingReference: string;
}

const schema = new Schema<IBooking>({ 
	//Personal
	fullName: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	phone: {
		type: String,
		trim:true
	},

	//Experience
	experienceId: {
		type: Schema.Types.ObjectId, 
		ref: "Experience",
		required: true,
		index: true
	},
	slotId: {
		type: Schema.Types.ObjectId,
		ref: "Slot",
		required: true,
		index: true
	},
	date: {
		type: Date, 
		required: true,
		index: true
	},
	time: {
		type: String,
		required: true
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
		default: 1
	},

	//Price
	subtotal: {
		type: Number,
		required: true
	},
	taxes: {
		type: Number,
		required: true,
		default: 0
	},
	discount: {
		type: Number,
		default: 0
	},
	promoCode: {
		type: String,
		trim: true,
		uppercase: true,
		default: null
	},
	total: {
		type: Number,
		required: true
	},

	//Booking
	bookingReference: {
		type: String,
		required: true,
		unique: true,
		index: true,
		default: generateBookingReference
	},
}, {
	timestamps: true
});

export function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HU${timestamp}${random}`;
}

schema.index({ experienceId: 1, date: 1 });

export default model<IBooking>("Booking", schema);