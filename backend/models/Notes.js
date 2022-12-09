import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: new Date
    }
});

module.exports = ('notes', NotesSchema)