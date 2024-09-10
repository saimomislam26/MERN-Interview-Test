const Drawing = require('../models/drawingModel')

module.exports.createDrawing = async (req, res) => {
    try {
        const drawing = new Drawing(req.body);
        await drawing.save();
        res.status(201).send(drawing);
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports.getAllDrawings = async (req, res) => {
    try {
        const drawings = await Drawing.find();
        res.status(200).send(drawings);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports.getIndividualDrawing = async (req, res) => {
    try {
        const drawing = await Drawing.findById(req.params.id);
        if (!drawing) return res.status(404).send();
        res.status(200).send(drawing);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports.updateIndividualDrawing = async (req, res) => {
    try {
        const drawing = await Drawing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!drawing) return res.status(404).send();
        res.status(200).send(drawing);
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports.deleteIndividualDrawing = async (req, res) => {
    try {
        const drawing = await Drawing.findByIdAndDelete(req.params.id);
        if (!drawing) return res.status(404).send();
        res.status(200).send(drawing);
    } catch (error) {
        res.status(500).send(error);
    }
}