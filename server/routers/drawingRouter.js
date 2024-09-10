const express = require('express')
const { createDrawing, getAllDrawings, getIndividualDrawing, updateIndividualDrawing, deleteIndividualDrawing} = require('../controllers/drawingController')
const router = express.Router()


router.route('/create-drawing').post(createDrawing)
router.route('/get-all-drawings').get(getAllDrawings)
router.route('/get-drawing/:id').get(getIndividualDrawing)
router.route('/update-drawing/:id').put(updateIndividualDrawing)
router.route('/delete-drawing/:id').delete(deleteIndividualDrawing)

module.exports = router