const express = require("express");
const router = express.Router();
const bancosService = require("#src/services/bancos-service.js");

// Obtener todos los bancos
router.get("/", async (_, res) => {
    try {
        const bancos = await bancosService.getAll();
        res.status(200).json(bancos);
    } catch (e) {
        res.status(404).json({ msg: "No se pudieron obtener los bancos" });
    }
});

// Obtener un banco usando el _id de mongodb
router.get("/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const banco = await bancosService.get(_id);
        res.status(200).json(banco);
    } catch (e) {
        res.status(404).json({ msg: `No se pudo obtener el banco con _id: ${_id}` });
    }
});

// Crear un banco
router.post("/", async (req, res) => {
    try {
        const result = await bancosService.create(req.body);
        if (result.insertedCount) {
            res.status(200).json({
                msg: "Bancos creados correctamente",
            });
        } else {
            res.status(200).json({
                msg: `Banco creado correctamente con id: ${result.insertedId}`,
            });
        }
    } catch (e) {
        res.status(400).json({ msg: `No se pudo crear el banco: ${req.body}` });
    }
});

router.put("/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        const result = await bancosService.update(_id, req.body);
        if (result.modifiedCount) {
            res.status(200).json({
                msg: `Banco con _id: ${_id} actualizado correctamente`,
            });
        } else {
            res.status(200).json({
                msg: `No se pudo actualizar el banco con _id: ${_id}`,
            });
        }
    } catch (e) {
        res.status(400).json({ msg: `No se pudo actualizar el banco con _id: ${_id}` });
    }
});

// Eliminar todos los bancos
router.delete("/", async (_, res) => {
    try {
        await bancosService.deleteAll();
        res.status(200).json({ msg: "Bancos eliminados correctamente" });
    } catch (e) {
        res.status(400).json({ msg: "No se pudieron eliminar los bancos" });
    }
});

// Eliminar un banco usando el _id de mongodb
router.delete("/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
        await bancosService.delete(_id);
        res.status(200).json({ msg: `Banco ${_id} eliminado correctamente` });
    } catch (e) {
        res.status(400).json({ msg: `No se pudo eliminar el banco con _id: ${_id}` });
    }
});

module.exports = router;
