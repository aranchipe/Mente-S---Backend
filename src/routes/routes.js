const express = require('express');
const { cadastro, login } = require('../controllers/profissionais');

const route = express()

route.post('/profissional', cadastro)
route.post('/login', login)

module.exports = route