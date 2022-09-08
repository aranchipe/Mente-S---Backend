const yup = require('./settings');

const schemaCadastroPaciente = yup.object().shape({
    nome: yup.string().required('O campo nome é obrigatório'),
    genero: yup.string().required('O campo genero é obrigatório'),
    cpf: yup.string().required('O campo cpf é obrigatório'),
    telefone: yup.string().required('O campo telefone é obrigatório'),
    email: yup.string().email().required('O campo email é obrigatório')
})



module.exports = {
    schemaCadastroPaciente
};