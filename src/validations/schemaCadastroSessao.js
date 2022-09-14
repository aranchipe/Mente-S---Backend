const yup = require('./settings');

const schemaCadastroSessao = yup.object().shape({
    paciente_id: yup.number().required('O campo paciente_id é obrigatório'),
    data: yup.date().required('O campo data é obrigatório'),
    status: yup.string().required('O campo status é obrigatório'),
    tema: yup.string().required('O campo tema é obrigatório'),
    tipo: yup.string().required('O campo tipo é obrigatório')
})



module.exports = {
    schemaCadastroSessao
};