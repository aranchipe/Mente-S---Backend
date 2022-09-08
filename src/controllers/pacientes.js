const { schemaCadastroPaciente } = require('../validations/schemaCadastroPaciente')
const knex = require('../database/connection');

const cadastroPaciente = async (req, res) => {
    const { profissional_id, nome, data_nascimento, cpf, genero, endereco, email, telefone } = req.body


    if (cpf.length !== 11) {
        return res.status(400).json({ "mensagem": "Digite um cpf válido" })
    }

    if (!profissional_id) {
        return res.status(400).json({ "mensagem": "O campo profissional_id é obrigatório" })
    }

    try {
        await schemaCadastroPaciente.validate(req.body)

        const profissionalEncontrado = await knex('profissionais').where({ id: profissional_id })

        if (profissionalEncontrado.length === 0) {
            return res.status(404).json({ "mensagem": "Profissional não encontrado" })
        }

        const emailPacienteEncontrado = await knex('pacientes')
            .where({ email })
            .first();

        if (emailPacienteEncontrado) {
            return res.status(400).json({ "mensagem": "Email já cadastrado" });
        }

        const cpfPacienteEncontrado = await knex('pacientes')
            .where({ cpf })
            .first();


        if (cpfPacienteEncontrado) {
            return res.status(400).json({ "mensagem": "CPF já cadastrado" });
        }

        const telefonePacienteEncontrado = await knex('pacientes')
            .where({ telefone })
            .first();


        if (telefonePacienteEncontrado) {
            return res.status(400).json({ "mensagem": "Número de telefone já cadastrado" });
        }

        const pacienteCadastrado = await knex('pacientes')
            .insert({
                nome,
                email,
                cpf,
                telefone,
                endereco,
                profissional_id,
                genero,
                data_nascimento
            });

        if (pacienteCadastrado.length === 0) {
            return res.status(500).json({ "mensagem": "Não foi possível cadastrar o paciente" });
        }

        return res.status(200).json({ "mensagem": "Paciente cadastrado com sucesso" });

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });

    }
}

const listarPacientes = async (req, res) => {
    const { profissional } = req

    try {
        const pacientes = await knex('pacientes')
            .select(
                'pa.id',
                'pr.nome as profissional',
                'pa.nome',
                'pa.data_nascimento',
                'pa.cpf',
                'pa.genero',
                'pa.endereco',
                'pa.email',
                'pa.telefone'
            )
            .from('pacientes as pa')
            .leftJoin('profissionais as pr', 'pr.id', 'pa.profissional_id')
            .where({ profissional_id: profissional.id })


        return res.status(200).json(pacientes)
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message })
    }
}

module.exports = {
    cadastroPaciente,
    listarPacientes
}