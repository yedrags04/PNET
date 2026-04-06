const { getCollection } = require("#src/db.js");
const { ObjectId } = require("mongodb");

const getAll = async () => {
    const collection = getCollection("utensilios");
    return await collection.find({}).toArray();
};

const get = async (id) => {
    const collection = getCollection("utensilios");
    // Convertimos el string que viene de la URL a un ObjectId de MongoDB
    return await collection.findOne({ _id: new ObjectId(id) });
};

module.exports = { getAll, get };
