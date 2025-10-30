import { Document, Schema, Types, model } from "mongoose";

export interface ISlot extends Document {
	experienceId: Types.ObjectId;
	date: Date;
	time: string;
	capacity: number;
	booked: number;
	available: number;
	status: 'available' | 'low' | 'sold_out';
}

const schema = new Schema<ISlot>({
	experienceId:  {
		type: Schema.Types.ObjectId,
		ref: "Experience",
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
	capacity: {
		type: Number,
		required: true,
		default: 10
	},
	booked: {
		type: Number,
		default: 0
	},
	available: {
		type: Number,
		default: function() {
			return this.capacity;
		}
	},
	status: {
		type: String,
		enum: ['available', 'low', 'sold_out'],
		default: 'available'
	}
}, {
	timestamps: true
});


schema.index({experienceId: 1, date: 1, time: 1});

schema.pre<ISlot>('save', function(next) {
	const available = this.capacity - this.booked;
	this.available = available;

	if(available === 0){
		this.status = "sold_out";
	} else if(available <= 5){
		this.status = "low";
	} else {
		this.status = "available";
	}

	next()
})

export default model<ISlot>("Slot", schema);