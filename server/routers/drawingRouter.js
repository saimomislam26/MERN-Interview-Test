const express = require('express')
const { createDrawing} = require('../controllers/drawingController')
const router = express.Router()


router.route('/create-drawing').post(createDrawing)

module.exports = router