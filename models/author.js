let mongoose = require('mongoose');
let moment = require('moment');
let authorSchema = mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    name: {
        firstName: {
        type: String,
        required:true
        },
        lastName: String
    },
    dob:{
        type:Date,
        get: function(newDate){
            return moment(newDate).format('DD-MM-YYYY');
        }
    },
    address: {
        state:{
            type: String,
            validate: {
                validator: function (stateValue){
                    return stateValue.length >= 2 && stateValue.length <=3
                },
                message: 'state should between 2 and 3 characters'
            }
        },
        suburb: String,
        street:String,
        unit:String
    },
    numberBook: {
        type:Number,
        validator:{
            validator: function(bookNum){
                return Number.isInteger(bookNum) && bookNum>=1 && bookNum<=150
            },
            message:'the book number must be an integer and >=1, <=150'
        }
    }
});

module.exports = mongoose.model('Author',authorSchema);

