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