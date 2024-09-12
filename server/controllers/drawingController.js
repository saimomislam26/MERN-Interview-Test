const mongoose = require('mongoose')
const Drawing = require('../models/drawingModel')

module.exports.createDrawing = async (req, res) => {
    const { title, drawings } = req.body;
    // console.log({title, drawings});
    
    // Check if both title and drawings are provided
    if (!title || drawings.length < 1) {
        return res.status(400).json({
            message: 'Title and drawings are required.'
        });
    }

    try {
        // Create new drawing instance
        const drawing = new Drawing({ title, shapes: drawings });

        // Save the drawing to the database
        await drawing.save();

        // Send success response
        res.status(201).json(drawing);
    } catch (error) {
        // Handle validation errors or database errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Invalid data format.',
                details: error.errors
            });
        }

        // General error handling
        res.status(500).json({
            message: 'An error occurred while saving the drawing.',
            details: error.message
        });
    }
};


module.exports.getAllDrawings = async (req, res) => {
    try {
        // Get page and limit from query, with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate page and limit
        if (page <= 0 || limit <= 0) {
            return res.status(400).json({
                message: 'Page and limit must be positive integers.'
            });
        }

        // Calculate skip value
        const skip = (page - 1) * limit;

        // Get total count of documents
        const total = await Drawing.countDocuments();

        // Fetch drawings with pagination
        const drawings = await Drawing.find()
            .skip(skip)
            .limit(limit);

        // Return paginated response
        res.status(200).json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            drawings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while fetching drawings.',
            message: error.message
        });
    }
};

module.exports.getIndividualDrawing = async (req, res) => {
    try {

        // Find drawing by ID
        const drawing = await Drawing.findById(req.params.id);

        // Handle if drawing is not found
        if (!drawing) {
            return res.status(404).json({ message: "Drawing not found" });
        }

        // Successfully return drawing data
        res.status(200).json(drawing);

    } catch (error) {
        // Error handling for invalid ObjectID or other server issues
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid drawing ID format" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.updateIndividualDrawing = async (req, res) => {
    // Validate the drawing ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid drawing ID' });
    }

    try {
        const drawing = await Drawing.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!drawing) {
            return res.status(404).json({ message: 'Drawing not found' });
        }

        return res.status(200).json({ drawing, message: "Drawing Updated Successfully" });
    } catch (error) {

        // Handle other errors (e.g., database connection issues)
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}

module.exports.deleteIndividualDrawing = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid drawing ID.' });
        }

        // Attempt to find and delete the drawing
        const drawing = await Drawing.findByIdAndDelete(id);

        if (!drawing) {
            return res.status(404).json({ message: 'Drawing not found.' });
        }

        // Return success response
        return res.status(200).json({ message: 'Drawing deleted successfully.', drawing });
    } catch (error) {
        // Log error and return internal server error
        console.error('Error deleting drawing:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};
