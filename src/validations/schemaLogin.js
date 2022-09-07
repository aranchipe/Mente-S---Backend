const yup = require('./settings');


const schemaLogin = yup.object().shape({
    email: yup.string().email().required('O campo email é obrigatório'),
    senha: yup.string().required('O campo senha é obrigatório').min(6),
})

module.exports = {
    schemaLogin
};