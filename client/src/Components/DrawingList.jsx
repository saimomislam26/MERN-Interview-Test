import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DrawingList = () => {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const response = await axios.get('/drawings');
        setDrawings(response.data);
      } catch (error) {
        console.error('Error fetching drawings:', error);
      }
    };
    fetchDrawings();
  }, []);

  const renderDrawing = (drawing) => {
    const canvas = document.getElementById(`canvas-${drawing._id}`);
    const context = canvas.getContext('2d');

    // Render each shape on the canvas
    drawing.shapes.forEach((shape) => {
      if (shape.type === 'line') {
        context.beginPath();
        context.moveTo(shape.start.x, shape.start.y);
        context.lineTo(shape.end.x, shape.end.y);
        context.stroke();
      } else if (shape.type === 'rectangle') {
        const width = shape.end.x - shape.start.x;
        const height = shape.end.y - shape.start.y;
        context.strokeRect(shape.start.x, shape.start.y, width, height);
      } else if (shape.type === 'circle') {
        const radius = Math.sqrt(Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2));
        context.beginPath();
        context.arc(shape.start.x, shape.start.y, radius, 0, 2 * Math.PI);
        context.stroke();
      }
    });
  };

  return (
    <div>
      <h1>Saved Drawings</h1>
      {drawings.map((drawing) => (
        <div key={drawing._id}>
          <canvas id={`canvas-${drawing._id}`} width={800} height={600} style={{ border: '1px solid #000' }} />
          {renderDrawing(drawing)}
        </div>
      ))}
    </div>
  );
};

export default DrawingList;
