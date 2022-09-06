const express = require('express');
const { cadastro } = require('../controllers/profissionais');

const route = express()

route.post('/profissional', cadastro)

module.exports = route