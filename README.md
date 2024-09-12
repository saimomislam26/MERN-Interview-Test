# Whiteboard App - MERN Stack

**Whiteboard Application** built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). This app allows users to draw shapes, add text annotations, and use an eraser to edit or remove drawings. The app is responsive and persists the drawings in a MongoDB database.

Live Linnk - [https://mern-interview-test-six.vercel.app/](https://mern-interview-test-six.vercel.app/)

## Features

- **Drawing Tools**: Line, Rectangle, Circle.
- **Text Annotations**: Add text anywhere on the canvas by clicking.
- **Eraser**: Remove shapes and text annotations.
- **Undo**: Step back through your drawing history.
- **Clear Canvas**: Remove all drawings from the canvas.
- **Save Drawings**: Persist drawings to MongoDB.
- **Load and Edit Drawings**: Fetch previously saved drawings, edit them, and save the changes.
- **Responsive Design**: Canvas adjusts to screen size dynamically.
- **Real-time Drawing**: Modifications are instantly reflected on the canvas.
- **Single Drawing View**: Edit individual drawings fetched from the database.

## Project Structure

- **Frontend**: React.js
  - The canvas is implemented using HTML5's `<canvas>` element.
  - Material-UI (MUI) is used for designing UI components like buttons and input fields.
- **Backend**: Node.js, Express.js, mongoose
  - API for saving, updating, deleting, and retrieving drawings.
- **Database**: MongoDB Atlas

## API Endpoints

- **GET /drawing**: Fetch all saved drawings.
- **GET /drawing/:id**: Fetch a specific drawing by ID.
- **POST /drawing**: Save a new drawing.
- **PUT /drawing/:id**: Update an existing drawing.
- **DELETE /drawing/:id**: Delete a specific drawing.

## Requirements

- **Node.js**: >= v16.0.0
- **MongoDB Atlas** account (for cloud-based database)

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone git@github.com:saimomislam26/MERN-Interview-Test.git
   cd MERN-Interview-Test

2. **Install dependencies for backend**:

   ```bash
   cd server
   npm install

3. ** Configure environment variables ** :

   Create a .env file in the server directory and add your MongoDB Atlas URI or local MongoDB Compass URI and React client side URI

   ```bash
   MONGODB_URL = 
   CLIENT_URL = http://localhost:5173/

4. ** Start the backend ** :
   
   ```bash
   npm start

5. **Install dependencies for frontend**:
   Go to the root directory in another terminal
   ```bash
   cd client
   npm install
   
6. ** Configure environment variables ** :

   Create a .env file in the client directory

   ```bash
   VITE_API_URL = http://localhost:5000/api/drawing

7. ** Start the frontend ** :
   
   ```bash
   npm run build
   npm run dev

## Running the React App from the Same Port as the Backend

   You can serve the React app from the Express.js backend from the following configuration to  `app.js` from server folder:
   
   ```javascript
   const path = require('path');
   app.use(express.static(path.join(__dirname, "../client/dist")));
   app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
   });




