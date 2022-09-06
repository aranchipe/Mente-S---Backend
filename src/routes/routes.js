const express = require('express');
const { cadastro } = require('../controllers/profissionais');

const route = express()

route.post('/cadastro', cadastro)

module.exports = route