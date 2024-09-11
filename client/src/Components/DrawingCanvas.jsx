import React, { useRef, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CropDinIcon from '@mui/icons-material/CropDin';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import UndoIcon from '@mui/icons-material/Undo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import { Input } from '@mui/material';
import { toast } from 'react-toastify';

import axios from 'axios'
import Loader from '../../utils/Loader';

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('line');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [drawings, setDrawings] = useState([]);
  const [drawingTitle, setDrawingTitle] = useState("Drawing")
  const [textInput, setTextInput] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    value: '',
  });
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCtx(context);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 0.95;
      canvas.height = window.innerHeight - 150; 
      redraw(context);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawings]);


    // Redraw the canvas based on saved drawings and scale
    const redrawWithScale = (context, widthScale, heightScale) => {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawings.forEach((drawing) => {
        const scaledStart = {
          x: drawing.start.x * widthScale,
          y: drawing.start.y * heightScale,
        };
        const scaledEnd = drawing.end
          ? { x: drawing.end.x * widthScale, y: drawing.end.y * heightScale }
          : null;
  
        switch (drawing.type) {
          case 'line':
            drawLine(context, scaledStart, scaledEnd);
            break;
          case 'rectangle':
            drawRectangle(context, scaledStart, scaledEnd);
            break;
          case 'circle':
            drawCircle(context, scaledStart, scaledEnd);
            break;
          case 'text':
            drawText(context, drawing.text, scaledStart, drawing.color, drawing.fontSize);
            break;
          default:
            break;
        }
      });
    };

  // Adjust the mouse position to account for canvas size changes
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvasRef.current.width,
      y: ((e.clientY - rect.top) / rect.height) * canvasRef.current.height,
    };
  };

  // Redraw the canvas
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
          drawText(context, drawing.text, drawing.start);
          break;
        default:
          break;
      }
    });
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
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

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const currentPos = getMousePos(e);
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

  const handleMouseUp = (e) => {
    if (!isDrawing) return;

    const endPos = getMousePos(e);
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

  const drawLine = (context, start, end) => {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.stroke();
  };

  const drawRectangle = (context, start, end) => {
    const width = end.x - start.x;
    const height = end.y - start.y;
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(start.x, start.y, width, height);
  };

  const drawCircle = (context, start, end) => {
    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    context.beginPath();
    context.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.stroke();
  };

  const drawText = (context, text, position) => {
    context.font = '20px Arial';
    context.fillStyle = 'black';
    context.fillText(text, position.x, position.y);
  };

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
      redrawWithScale(ctx, 1, 1); // Redraw the canvas without the erased shape
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
    };

    setDrawings([...drawings, newText]);
    setTextInput({
      visible: false,
      position: { x: 0, y: 0 },
      value: '',
    });
  };

  const clearLastShape = () => {
    setDrawings(drawings.slice(0, -1));
    redraw(ctx);
  };

  const resetCanvas = () => {
    setDrawings([]);
    redraw(ctx);
  };

  const saveDrawing = async () => {
    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/create-drawing`, { title: drawingTitle, drawings });
      toast.success("Drawing Saved Succesfully", {  autoClose: 2000, pauseOnHover: false })
    } catch (error) {
      toast.warning("'Error saving drawing", {  autoClose: 2000, pauseOnHover: false })
      console.error('Error saving drawing:', error);
    }finally{
      setLoading(false)
    }
  };

  const handleDrawingTitle = (e) => {
    setDrawingTitle(e.target.value)
  }

  if(loading){
    return (
      <Loader/>
    )
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
        {/* Tool Buttons */}
        <Input
          placeholder="Drawing Title"
          sx={{ '--Input-focused': 1, width: 180 }}
          value={drawingTitle}
          onChange={handleDrawingTitle}
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={() => setTool('line')}
          startIcon={<ArrowRightAltIcon />}
          sx={{ marginLeft: "5px" }}
        >
          Line
        </Button>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={() => setTool('rectangle')}
          startIcon={<CropDinIcon />}
        >
          Rectangle
        </Button>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={() => setTool('circle')}
          startIcon={<TripOriginIcon />}
        >
          Circle
        </Button>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={() => setTool('text')}
          startIcon={<KeyboardIcon />}
        >
          Text
        </Button>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={() => setTool('eraser')}
          startIcon={<AutoFixNormalIcon />}
        >
          Eraser
        </Button>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={clearLastShape}
          startIcon={<UndoIcon />}
        >
          Undo
        </Button>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={resetCanvas}
          startIcon={<RestartAltIcon />}
        >
          Reset
        </Button>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={saveDrawing}
          startIcon={<SaveIcon />}
        >
          Save Drawing
        </Button>
      </div>

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

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          border: '1px solid black',
          display: 'block',
          margin: '20px auto',
          backgroundColor: 'white',
          borderRadius: '20px',
          width: '95%',
          height: 'calc(100vh - 150px)',
        }}
      />
    </div>
  );
};

export default DrawingCanvas;
