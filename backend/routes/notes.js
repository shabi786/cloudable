const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes')

//Route 1: Endpoint for adding notes 
router.post('/addnote', [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], fetchuser, async (req, res) => {

    //checking errors in error array
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        req.status(500).send("Internal Server Error")
    }

})

//Route 2: Endpoint for fetching all the notes
router.get('/fetchnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({user: req.user.id})
    res.json(notes);
})


module.exports = router