const { getCollection } = require("#src/db.js");
const { ObjectId } = require("mongodb");

/**
 * @typedef {Object} ReservaData
 * @property {string} leaderName
 * @property {string} leaderEmail
 * @property {number} experience
 * @property {string} bankId ObjectId del banco en formato hexadecimal
 * @property {string} operationDate
 * @property {string} operationTime
 * @property {number} teamSize
 * @property {string} riskLevel
 * @property {number} budget
 * @property {string} equipment
 * @property {string} plan
 * @property {string[]} specialties
 * @property {string} status
 * @property {string} createdAt
 */

/**
 * @typedef {ReservaData & { _id: import("mongodb").ObjectId }} Reserva
 */

class ReservasService {
    /** @returns {Promise<Reserva[]>} */
    async getAll() {
        const reservasCollection = await getCollection("reservas");
        return await reservasCollection.find({}).toArray();
    }

    /**
     * @param {string} _id
     * @returns {Promise<Reserva | null>}
     */
    async get(_id) {
        const reservasCollection = await getCollection("reservas");
        return await reservasCollection.findOne({ _id: ObjectId.createFromHexString(_id) });
    }

    /**
     * @param {ReservaData | ReservaData[]} data
     * @returns {Promise<import("mongodb").InsertOneResult<ReservaData> | import("mongodb").InsertManyResult<ReservaData>>}
     */
    async create(data) {
        const reservasCollection = await getCollection("reservas");
        if (Array.isArray(data)) {
            return await reservasCollection.insertMany(data);
        } else {
            return await reservasCollection.insertOne(data);
        }
    }

    /**
     * @returns {Promise<import("mongodb").DeleteResult>}
     */
    async deleteAll() {
        const reservasCollection = await getCollection("reservas");
        return await reservasCollection.deleteMany({});
    }

    /**
     * @param {string} _id
     * @returns {Promise<import("mongodb").DeleteResult>}
     */
    async delete(_id) {
        const reservasCollection = await getCollection("reservas");
        return await reservasCollection.deleteOne({ _id: ObjectId.createFromHexString(_id) });
    }

    /**
     * @param {string} _id
     * @param {Partial<ReservaData>} data
     * @returns {Promise<import("mongodb").UpdateResult>}
     */
    async update(_id, data) {
        const reservasCollection = await getCollection("reservas");
        return await reservasCollection.updateOne(
            { _id: ObjectId.createFromHexString(_id) },
            { $set: data },
        );
    }
}

module.exports = new ReservasService();
