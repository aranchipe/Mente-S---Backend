const securePassword = require('secure-password');
const knex = require('../database/connection');
const pwd = securePassword();
const { schemaCadastroProfissional } = require('../validations/schemaCadastroProfissional')
const { schemaLogin } = require('../validations/schemaLogin')
const jwt = require('jsonwebtoken');


const cadastroProfissional = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ "mensagem": "Preencha todos os campos obrigatórios" })
    }

    try {
        await schemaCadastroProfissional.validate(req.body)

        const profissionalEncontrado = await knex('profissionais').where({ email })

        if (profissionalEncontrado.length > 0) {
            return res.status(400).json({ "mensagem": "Usuário já cadastrado" })
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

const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        await schemaLogin.validate(req.body)

        const profissionalEncontrado = await knex('profissionais').where({ email })

        if (profissionalEncontrado.length === 0) {
            return res.status(404).json({ "mensagem": "Email ou senha incorretos" })
        }
        const profissional = profissionalEncontrado[0]

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(profissional.senha, 'hex'))

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json({ "mensagem": "Email ou senha incorretos" });
            case securePassword.VALID:
                break
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex')
                    await knex('profissionais').update({ senha: hash }).where({ email })
                } catch {
                }
                break
        }

        const token = jwt.sign(
            {
                id: profissional.id,
                nome: profissional.nome,
                email: profissional.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '8h'
            }
        )

        return res.status(200).json({
            "usuario":
            {
                "id": profissional.id,
                "nome": profissional.nome,
                "email": profissional.email
            },
            "token": token
        });
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });
    }
}


module.exports = {
    cadastroProfissional,
    login
}