import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DrawingList = () => {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-all-drawings`);
        setDrawings(response.data);
      } catch (error) {
        console.error('Error fetching drawings:', error);
      }
    };
    fetchDrawings();
  }, []);

  useEffect(() => {
    drawings.forEach(drawing => {
      const canvas = document.getElementById(`canvas-${drawing._id}`);
      if (canvas) {
        const context = canvas.getContext('2d');
        // Set canvas size to match data if necessary
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.6;

        // Render each shape on the canvas
        drawing.shapes.forEach((shape) => {
          switch (shape.type) {
            case 'line':
              drawLine(context, shape.start, shape.end, shape.color, shape.thickness);
              break;
            case 'rectangle':
              drawRectangle(context, shape.start, shape.end, shape.color, shape.thickness);
              break;
            case 'circle':
              drawCircle(context, shape.start, shape.end, shape.color, shape.thickness);
              break;
            case 'text':
              drawText(context, shape.text, shape.start, shape.color, shape.fontSize);
              break;
            default:
              break;
          }
        });
      }
    });
  }, [drawings]);

  // Drawing functions
  const drawLine = (context, start, end, color, thickness) => {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.strokeStyle = color || 'black';
    context.lineWidth = thickness || 1;
    context.stroke();
  };

  const drawRectangle = (context, start, end, color, thickness) => {
    const width = end.x - start.x;
    const height = end.y - start.y;
    context.strokeStyle = color || 'black';
    context.lineWidth = thickness || 1;
    context.strokeRect(start.x, start.y, width, height);
  };

  const drawCircle = (context, start, end, color, thickness) => {
    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    context.beginPath();
    context.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    context.strokeStyle = color || 'black';
    context.lineWidth = thickness || 1;
    context.stroke();
  };

  const drawText = (context, text, position, color, fontSize) => {
    context.font = `${fontSize || 20}px Arial`;
    context.fillStyle = color || 'black';
    context.fillText(text, position.x, position.y);
  };

  return (
    <div>
      <h1>Saved Drawings</h1>
      {drawings.map((drawing) => (
        <div key={drawing._id}>
          <canvas id={`canvas-${drawing._id}`} style={{
            border: '1px solid black',
            display: 'block',
            margin: '20px auto',
          }} />
        </div>
      ))}
    </div>
  );
};

export default DrawingList;
