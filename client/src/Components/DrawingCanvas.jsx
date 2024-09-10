import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('line'); // Default tool
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [drawings, setDrawings] = useState([]);

  // Initialize the canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);

    // Make the canvas responsive
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.6;
      // Redraw the existing shapes
      redraw(context);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawings]);

  // Redraw the canvas based on saved drawings
  const redraw = (context) => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawings.forEach(drawing => {
      if (drawing.type === 'line') {
        drawLine(context, drawing.start, drawing.end);
      } else if (drawing.type === 'rectangle') {
        drawRectangle(context, drawing.start, drawing.end);
      } else if (drawing.type === 'circle') {
        drawCircle(context, drawing.start, drawing.end);
      } else if (drawing.type === 'text') {
        drawText(context, drawing.text, drawing.start);
      }
    });
  };

  // Mouse down event to start drawing
  const handleMouseDown = (e) => {
    setStartPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setIsDrawing(true);
  };

  // Mouse move event to draw continuously
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const currentPos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    redraw(ctx);

    if (tool === 'line') {
      drawLine(ctx, startPos, currentPos);
    } else if (tool === 'rectangle') {
      drawRectangle(ctx, startPos, currentPos);
    } else if (tool === 'circle') {
      drawCircle(ctx, startPos, currentPos);
    }
  };

  // Mouse up event to finish drawing
  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    const endPos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

    if (tool === 'line') {
      setDrawings([...drawings, { type: 'line', start: startPos, end: endPos }]);
    } else if (tool === 'rectangle') {
      setDrawings([...drawings, { type: 'rectangle', start: startPos, end: endPos }]);
    } else if (tool === 'circle') {
      setDrawings([...drawings, { type: 'circle', start: startPos, end: endPos }]);
    }

    setIsDrawing(false);
  };

  // Drawing functions
  const drawLine = (context, start, end) => {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  };

  const drawRectangle = (context, start, end) => {
    const width = end.x - start.x;
    const height = end.y - start.y;
    context.strokeRect(start.x, start.y, width, height);
  };

  const drawCircle = (context, start, end) => {
    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    context.beginPath();
    context.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    context.stroke();
  };

  const drawText = (context, text, start) => {
    context.font = '20px Arial';
    context.fillText(text, start.x, start.y);
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

  return (
    <div>
      <div className="toolbar">
        <button onClick={() => setTool('line')}>Line</button>
        <button onClick={() => setTool('rectangle')}>Rectangle</button>
        <button onClick={() => setTool('circle')}>Circle</button>
        <button onClick={() => setTool('text')}>Text</button>
        <button onClick={() => setTool('eraser')}>Eraser</button>
        <button onClick={saveDrawing}>Save Drawing</button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #000', width: '100%', height: 'auto' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default DrawingCanvas;
