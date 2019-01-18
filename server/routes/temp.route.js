'use strict';

const tempController =  require('../controllers/temp.controller');
const express   =   require('express');

const route = express.Router();

route.post('/create', tempController.create);

module.exports = route;
