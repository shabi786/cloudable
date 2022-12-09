const mongoose = require('mongoose');
const mongooseURI = "mongodb://localhost:27017"

const MongoConnect = () => {
    mongoose.connect(mongooseURI,()=> {
        console.log("Connected to Mongoose");
    })

}

module.exports = MongoConnect;