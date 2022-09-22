const express = require('express');
const { cadastroPaciente, listarPacientes, detalharPaciente, deletarPaciente, atualizarPaciente } = require('../controllers/pacientes');
const { login, cadastroProfissional } = require('../controllers/profissionais');
const { cadastroSessao, listarSessoes, detalharSessao, atualizarSessao, deletarSessao, deletarSessoesDoPaciente } = require('../controllers/sessoes');
const { verificarLogin } = require('../middlewares/verificarLogin');

const route = express()

route.post('/profissional', cadastroProfissional)
route.post('/login', login)

route.use(verificarLogin)

route.post('/paciente', cadastroPaciente)
route.get('/paciente', listarPacientes)
route.get('/paciente/:id', detalharPaciente)
route.put('/paciente/:id', atualizarPaciente)
route.delete('/paciente/:id', deletarPaciente)

route.post('/sessao', cadastroSessao)
route.get('/sessao', listarSessoes)
route.get('/sessao/:id', detalharSessao)
route.put('/sessao/:id', atualizarSessao)
route.delete('/sessao/:id', deletarSessao)

route.delete('/sessoes/:paciente_id', deletarSessoesDoPaciente)

module.exports = route