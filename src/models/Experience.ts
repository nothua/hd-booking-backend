import { Document, Schema, model } from "mongoose";

export interface IExperience extends Document {
	name: string;
	description: string;
	location: string;
	price: number;
	image: string;
	about: string;
	isActive: boolean;
}

const schema = new Schema<IExperience>({ 
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	about: {
		type: String,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: true
});

export default model<IExperience>("Experience", schema);