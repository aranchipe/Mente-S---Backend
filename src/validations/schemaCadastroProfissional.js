const yup = require('./settings');

const schemaCadastroProfissional = yup.object().shape({
    nome: yup.string().required('O campo nome é obrigatório'),
    email: yup.string().email().required('O campo email é obrigatório'),
    senha: yup.string().required('O campo senha é obrigatório').min(6)
})



module.exports = {
    schemaCadastroProfissional
};