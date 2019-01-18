'use strict';

const temp =  require('../routes/temp.route');


const express   =   require('express');

const route = express.Router();

route.use('/temp', temp);
//route.use('/dialog', dialog);


module.exports = route;
