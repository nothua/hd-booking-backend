import { Model, Document, ClientSession } from "mongoose";

class BaseRepository<T extends Document> {
    constructor(public model: Model<T>) { }

    async create(data: Partial<T>, session?: ClientSession): Promise<T> {
        const newDocument = new this.model(data);
        return newDocument.save({ session });
    }

    async edit(id: string, data: Partial<T>, session?: ClientSession): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true, session });
    }

    async delete(id: string, session?: ClientSession): Promise<T | null> {
        return this.model.findByIdAndDelete(id, { session });
    }

    async getAll(session?: ClientSession): Promise<T[]> {
        return this.model.find().session(session || null);
    }

    async getAllAndSelect(select: string, session?: ClientSession): Promise<T[]> {
        return this.model.find().select(select).session(session || null);
    }

    async get(id: string, session?: ClientSession): Promise<T | null> {
        if (id == "null" || !id) return null;
        return this.model.findById(id).session(session || null);
    }

    async getAndSelect(id: string, select: string, session?: ClientSession): Promise<T | null> {
        if (id == "null" || !id) return null;
        return this.model.findById(id).select(select).session(session || null);
    }

    async getByField(field: string, value: string, session?: ClientSession): Promise<T | null> {
        return this.model.findOne({ [field as any]: value }).session(session || null);
    }

    async upsert(data: Partial<T> & { _id?: string }, session?: ClientSession): Promise<T | null> {
        if (!data._id) data._id = data.id;
        return this.model.findOneAndUpdate({ _id: data._id }, data, {
            upsert: true,
            new: true,
            session
        });
    }
    
    async save(doc: T, session?: ClientSession): Promise<T> {
        return doc.save({ session });
    }
}

export default BaseRepository;