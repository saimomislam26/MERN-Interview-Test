import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('line'); // Default tool
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [drawings, setDrawings] = useState([]);
  const [textInput, setTextInput] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    value: '',
  });

  // Initialize the canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);

    // Make the canvas responsive
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.6;
      redraw(context);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawings]);

  // Redraw the canvas based on saved drawings
  const redraw = (context) => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawings.forEach((drawing) => {
      switch (drawing.type) {
        case 'line':
          drawLine(context, drawing.start, drawing.end);
          break;
        case 'rectangle':
          drawRectangle(context, drawing.start, drawing.end);
          break;
        case 'circle':
          drawCircle(context, drawing.start, drawing.end);
          break;
        case 'text':
          drawText(context, drawing.text, drawing.start, drawing.color, drawing.fontSize);
          break;
        default:
          break;
      }
    });
  };
  

  // Mouse down event to start drawing or show text input
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setStartPos(pos);

    if (tool === 'eraser') {
      eraseShape(pos);
    } else if (tool === 'text') {
      setTextInput({
        visible: true,
        position: pos,
        value: '',
      });
    } else {
      setIsDrawing(true);
    }
  };

  // Mouse move event to draw continuously
  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    redraw(ctx);

    switch (tool) {
      case 'line':
        drawLine(ctx, startPos, currentPos);
        break;
      case 'rectangle':
        drawRectangle(ctx, startPos, currentPos);
        break;
      case 'circle':
        drawCircle(ctx, startPos, currentPos);
        break;
      default:
        break;
    }
  };

  // Mouse up event to finish drawing
  const handleMouseUp = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const endPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const newDrawing = {
      type: tool,
      start: startPos,
      end: endPos,
      color: 'black',
      thickness: 1,
    };

    setDrawings([...drawings, newDrawing]);
    setIsDrawing(false);
  };

  // Drawing functions
  const drawLine = (context, start, end, color = 'black', thickness = 1) => {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
  };

  const drawRectangle = (context, start, end, color = 'black', thickness = 1) => {
    const width = end.x - start.x;
    const height = end.y - start.y;
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.strokeRect(start.x, start.y, width, height);
  };

  const drawCircle = (context, start, end, color = 'black', thickness = 1) => {
    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    context.beginPath();
    context.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
  };

  const drawText = (context, text, position, color = 'black', fontSize = 20) => {
    context.font = `${fontSize}px Arial`;
    context.fillStyle = color;
    context.fillText(text, position.x, position.y);
  };
  

  // Erase function
  const eraseShape = (pos) => {
    const shapeIndex = drawings.findIndex((shape) => {
      if (shape.type === 'line') {
        return isPointOnLine(pos, shape.start, shape.end);
      } else if (shape.type === 'rectangle') {
        return isPointInRectangle(pos, shape.start, shape.end);
      } else if (shape.type === 'circle') {
        return isPointInCircle(pos, shape.start, shape.end);
      } else if (shape.type === 'text') {
        return isPointOnText(pos, shape.start, shape.text);
      }
      return false;
    });

    if (shapeIndex > -1) {
      const updatedDrawings = [...drawings];
      updatedDrawings.splice(shapeIndex, 1); // Remove the shape
      setDrawings(updatedDrawings); // Update the state
      redraw(ctx); // Redraw the canvas without the erased shape
    }
  };

  // Helper functions to check if a point is on a shape
  const isPointOnLine = (point, start, end) => {
    const distance =
      Math.abs((end.y - start.y) * point.x - (end.x - start.x) * point.y + end.x * start.y - end.y * start.x) /
      Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
    return distance < 5; // Threshold for clicking near a line
  };

  const isPointInRectangle = (point, start, end) => {
    const xMin = Math.min(start.x, end.x);
    const xMax = Math.max(start.x, end.x);
    const yMin = Math.min(start.y, end.y);
    const yMax = Math.max(start.y, end.y);
    return point.x >= xMin && point.x <= xMax && point.y >= yMin && point.y <= yMax;
  };

  const isPointInCircle = (point, start, end) => {
    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const distanceFromCenter = Math.sqrt(Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2));
    return distanceFromCenter <= radius;
  };

  const isPointOnText = (point, position, text) => {
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = 20; // Approximate height based on font size
    return (
      point.x >= position.x &&
      point.x <= position.x + textWidth &&
      point.y <= position.y &&
      point.y >= position.y - textHeight
    );
  };

  // Save the drawing to the backend
  const saveDrawing = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/create-drawing`, { shapes: drawings });
      alert('Drawing saved!');
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  };

  // Clear the last shape or annotation
  const clearLastShape = () => {
    const updatedDrawings = [...drawings];
    updatedDrawings.pop(); // Remove the last shape or annotation
    setDrawings(updatedDrawings); // Update the state
    redraw(ctx); // Redraw the canvas without the last shape
  };

  // Reset the canvas by clearing all shapes
  const resetCanvas = () => {
    setDrawings([]); // Clear all shapes and annotations
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas
  };

  // Handle text input submission
  const handleTextSave = () => {
    if (textInput.value.trim() === '') {
      setTextInput({
        visible: false,
        position: { x: 0, y: 0 },
        value: '',
      });
      return;
    }
  
    const newText = {
      type: 'text',
      text: textInput.value,
      start: textInput.position,
      color: 'black', // Default color for text
      fontSize: 20,   // Default font size for text
    };
  
    setDrawings([...drawings, newText]);
    setTextInput({
      visible: false,
      position: { x: 0, y: 0 },
      value: '',
    });
  };
  
  return (
    <div style={{ position: 'relative' }}>
      <div className="toolbar" style={{ marginBottom: '10px' }}>
        <button onClick={() => setTool('line')}>Line</button>
        <button onClick={() => setTool('rectangle')}>Rectangle</button>
        <button onClick={() => setTool('circle')}>Circle</button>
        <button onClick={() => setTool('text')}>Text</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
        <button onClick={clearLastShape}>Clear Last</button>
        <button onClick={resetCanvas}>Reset All</button>
        <button onClick={saveDrawing}>Save Drawing</button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #000', width: '100%', height: 'auto' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      
      {/* Text input for annotations */}
      {textInput.visible && (
        <div
          style={{
            position: 'absolute',
            left: `${textInput.position.x}px`,
            top: `${textInput.position.y}px`,
            display: 'flex',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <input
            type="text"
            value={textInput.value}
            onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
            style={{
              border: '1px solid #ccc',
              fontSize: '16px',
              padding: '2px 4px',
            }}
            autoFocus
          />
          <button
            onClick={handleTextSave}
            style={{
              marginLeft: '5px',
              padding: '2px 6px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;
