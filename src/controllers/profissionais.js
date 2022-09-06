const securePassword = require('secure-password');
const knex = require('../database/connection');
const pwd = securePassword();
const { schemaCadastroProfissional } = require('../validations/schemaCadastroProfissional')

const cadastro = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ "mensagem": "Preencha todos os campos obrigatórios" })
    }

    try {
        await schemaCadastroProfissional.validate(req.body)

        const profissionalEncontrado = await knex('profissionais').where({ email })

        if (profissionalEncontrado.length > 0) {
            return res.status(400).json('Usuário já cadastrado')
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
        const profissionalCadastrado = await knex('profissionais').insert({
            nome,
            email,
            senha: hash,
        })

        if (profissionalCadastrado.length === 0) {
            return res.status(500).json({ "mensagem": "Não foi possível criar conta" });
        }

        return res.status(200).json({ "mensagem": "Profissional cadastrado com sucesso!" })

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}

module.exports = {
    cadastro
}