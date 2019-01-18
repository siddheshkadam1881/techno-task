'use strict';

const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
temperature:{
    type:Number,
    required:true,
  },
frequency:{
    type:Number,
    required:true,
  },
});

const temp = mongoose.model('temp', tempSchema);

exports.create = tempObj => temp.create(tempObj);


exports.get = tempObj => temp.find();

