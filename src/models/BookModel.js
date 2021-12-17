const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const BooksSchema = new mongoose.Schema({

    title: {
        type: String,
        required: 'title is required',
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: 'excerpt is required',
        trim: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true,
        trim: true
    },

    ISBN: {
        type: String,
        required: 'ISBN is required',
        unique: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trime: true

    },

    subcategory: {
        type: String,
        required: true,
        trim: true
    },

    reviews: {
        type: Number,
        default: 0,
        comment: {
            type: ObjectId,
            ref: 'Review',
            default: 0

        }
    },

    deletedAt: {
        type: Date,
        default: null

    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    releasedAt: {

        type: Date,
        default: Date.now(),
        required: true

    }


}, { timestamps: true })

module.exports = mongoose.model('BOOK', BooksSchema)