const express = require('express');
const { teste } = require('../controllers/teste');

const route = express()

route.get('/', teste)

module.exports = route