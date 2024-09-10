const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  x: Number,
  y: Number,
});

const shapeSchema = new mongoose.Schema({
  type: { type: String, enum: ['line', 'rectangle', 'circle', 'text'] },
  start: pointSchema,
  end: pointSchema,
  radius: Number, // for circles
  text: String,   // for text annotations
  color: String,
  thickness: Number,
});

const drawingSchema = new mongoose.Schema({
  title: { type: String },
  shapes: [shapeSchema],
  createdAt: { type: Date, default: Date.now },
});

const Drawing = mongoose.model('Drawing', drawingSchema);
module.exports = Drawing;
