var mongoose = require('mongoose');
var logger = require('../helpers/logger');
var Schema = mongoose.Schema;

// Define Products Schema
var Products = new Schema({
    sku: {
        type: String,
        index: true,
        require: true,
        unique:true
    },
    description:{
      type:String,
      require:true
    },
    amount:{
      type:Number,
      require:true
    }
});
module.exports = mongoose.model('Products', Products);
