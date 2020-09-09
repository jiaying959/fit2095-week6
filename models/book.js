let mongoose = require('mongoose');
let moment = require('moment');
let bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    isbn:{
        type: String,
        validate:{
            validator: function(isbnvalue){
                return isbnvalue.length == 13
            },
            message:'isbn should be 13 digits only'
        }
    },
    date: {
        type: Date, 
        default: Date.now,
        get: function(newDate){
            return moment(newDate).format('DD-MM-YYYY');
        }
    },
    summary:String
});

module.exports = mongoose.model('Book',bookSchema);