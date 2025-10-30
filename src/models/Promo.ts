import { Document, Schema, Types, model } from "mongoose";

export interface IPromo extends Document {
	code: string;
	discountType: 'percentage' | 'fixed';
	discountValue: number;
	isActive: boolean;
}

const schema = new Schema({
	code: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		uppercase: true
	},
	discountType: {
		type: String,
		enum: ['percentage', 'fixed'],
		required: true
	},
	discountValue: {
		type: Number,
		required: true
	},
	isActive: {
		type: Boolean,
		default: true
	},
}, {
	timestamps: true
});


export default model<IPromo>("Promo", schema);
