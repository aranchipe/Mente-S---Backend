const express = require('express');
const { cadastroPaciente, listarPacientes } = require('../controllers/pacientes');
const { login, cadastroProfissional } = require('../controllers/profissionais');
const { verificarLogin } = require('../middlewares/verificarLogin');

const route = express()

route.post('/profissional', cadastroProfissional)
route.post('/login', login)

route.use(verificarLogin)

route.post('/paciente', cadastroPaciente)
route.get('/paciente', listarPacientes)

module.exports = route