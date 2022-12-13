const JWT_TOKEN = "randomauthtoken";
const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token')
    if(!token) {
        res.status(401).send({error: "Please authenticate with valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_TOKEN)
        req.user = data.user
        next()
    } 
    catch (error) {
        res.status(401).send({error: "Please authenticate with valid token"})
    }
}
module.exports = fetchuser