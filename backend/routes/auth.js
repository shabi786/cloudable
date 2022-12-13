const express = require('express')
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_TOKEN = "randomauthtoken"
const fetchuser = require('../middleware/fetchuser') 

//Route 3-Endpoint to create a new user
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    //checking errors in error array
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //check if user with this email is already exists
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "User with this email already exists" })
        }
        //Generating salt and making hash of password to store in database
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_TOKEN);
        res.json({ authToken });

    }
    catch (error) {
        console.error(error.message);
        req.status(500).send("Internal Server Error")
    }

})
//Route 2-Endpoint to login user
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Checking for the email to present in the database for login 
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({ error: "Please login with correct credentials" })
        }
        //comparing given password with user password for login
        const passwordComp = await bcrypt.compare(password,user.password);
        if(!passwordComp) {
            return res.status(400).json({ error: "Please login with correct credentials" })
        }
        const data =  {
            user: {
                id: user.id
            }
        } 
        //Sending the authtoken in response 
        const authToken = jwt.sign(data, JWT_TOKEN);
        res.json({authToken})
    }
    catch (error) {
        console.error(error.message);
        req.status(500).send("Internal Server Error")
    }
})

//Route 3-Endpoint for getting the details of the user
router.post('/getuser',fetchuser, async (req, res) => {
    try {
        userId = req.user.id
        //We can fetch the user by the id and send response without showing password
        const user = await User.findById(userId).select("-password");
        res.send(user);
        
    } catch (error) {
        req.status(500).send("Internal Server Error")
    }
})

module.exports = router