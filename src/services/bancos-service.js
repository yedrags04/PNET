const { getCollection } = require("@src/db");
const { ObjectId } = require("mongodb");

class BancosService {
    async getAll() {
        const bancosCollection = await getCollection("bancos");
        return await bancosCollection.find({}).toArray();
    }

    async get(_id) {
        const bancosCollection = await getCollection("bancos");
        return await bancosCollection.findOne({ _id: ObjectId.createFromHexString(_id) });
    }
}

module.exports = new BancosService();
