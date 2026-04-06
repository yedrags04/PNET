const { getCollection } = require("#src/db.js");
const { ObjectId } = require("mongodb");

/**
 * @typedef {Object} BancoData
 * @property {string} name
 * @property {string} address
 * @property {string} difficulty
 * @property {number} reward
 * @property {boolean} available
 * @property {string} image
 */

/**
 * @typedef {BancoData & { _id: import("mongodb").ObjectId }} Banco
 */

class BancosService {
    /** @returns {Promise<Banco[]>} */
    async getAll() {
        const bancosCollection = await getCollection("bancos");
        return await bancosCollection.find({}).toArray();
    }

    /**
     * @param {string} _id
     * @returns {Promise<Banco | null>}
     */
    async get(_id) {
        const bancosCollection = await getCollection("bancos");
        return await bancosCollection.findOne({ _id: ObjectId.createFromHexString(_id) });
    }

    /**
     * @param {BancoData | BancoData[]} data
     * @returns {Promise<import("mongodb").InsertOneResult<BancoData> | import("mongodb").InsertManyResult<BancoData>>}
     */
    async create(data) {
        const bancosCollection = await getCollection("bancos");
        if (Array.isArray(data)) {
            return await bancosCollection.insertMany(data);
        } else {
            return await bancosCollection.insertOne(data);
        }
    }

    /**
     * @returns {Promise<import("mongodb").DeleteResult>}
     */
    async deleteAll() {
        const bancosCollection = await getCollection("bancos");
        return await bancosCollection.deleteMany({});
    }

    /**
     * @param {string} _id
     * @returns {Promise<import("mongodb").DeleteResult>}
     */
    async delete(_id) {
        const bancosCollection = await getCollection("bancos");
        return await bancosCollection.deleteOne({ _id: ObjectId.createFromHexString(_id) });
    }

    /**
     * @param {string} _id
     * @param {Partial<BancoData>} data
     * @returns {Promise<import("mongodb").UpdateResult>}
     */
    async update(_id, data) {
        const bancosCollection = await getCollection("bancos");
        return await bancosCollection.updateOne(
            { _id: ObjectId.createFromHexString(_id) },
            { $set: data },
        );
    }
}

module.exports = new BancosService();
