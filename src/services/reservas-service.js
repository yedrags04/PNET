const { getCollection } = require("#src/db.js");
const { ObjectId } = require("mongodb");

class ReservasService {
    async getAll() {
        const reservasCollection = await getCollection("reservas");
        return await reservasCollection.find({}).toArray();
    }

    async get(_id) {
        const reservasCollection = await getCollection("reservas");
        return await reservasCollection.findOne({ _id: new ObjectId(_id) });
    }

    async create(data) {
        const reservasCollection = await getCollection("reservas");
        // Aseguramos que la fecha de creación se guarde siempre
        const dataToSave = Array.isArray(data)
            ? data.map((d) => ({ ...d, createdAt: new Date().toISOString() }))
            : { ...data, createdAt: new Date().toISOString() };

        if (Array.isArray(dataToSave)) {
            return await reservasCollection.insertMany(dataToSave);
        } else {
            return await reservasCollection.insertOne(dataToSave);
        }
    }

    async update(_id, data) {
        const reservasCollection = await getCollection("reservas");
        return await reservasCollection.updateOne({ _id: new ObjectId(_id) }, { $set: data });
    }

    async delete(_id) {
        const reservasCollection = await getCollection("reservas");
        return await reservasCollection.deleteOne({ _id: new ObjectId(_id) });
    }
}

module.exports = new ReservasService();
