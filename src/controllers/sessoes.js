const knex = require('../database/connection');
const { schemaCadastroSessao } = require('../validations/schemaCadastroSessao')

const cadastroSessao = async (req, res) => {
    let { paciente_id, data, status, tema, duracao, tipo } = req.body
    const { profissional } = req

    const dataAtual = new Date()
    if ((+new Date(+data + 10800000)) < +dataAtual && status === 'Agendado') {
        status = 'Expirado'
    }


    try {
        await schemaCadastroSessao.validate(req.body)

        const pacienteEncontrado = await knex('pacientes')
            .where({ id: paciente_id })
            .andWhere({ profissional_id: profissional.id })

        if (pacienteEncontrado.length === 0) {
            return res.status(404).json({ "mensagem": "paciente não encontrado" })

        }

        const sessaoCadastrada = await knex('sessoes').insert({
            profissional_id: profissional.id,
            paciente_id,
            data,
            status,
            tema,
            duracao,
            tipo
        })

        if (sessaoCadastrada.length === 0) {
            return res.status(400).json({ "mensagem": "Não foi possível cadastrar a sessão" })
        }

        return res.status(200).json({ "mensagem": "Sessão cadastrada com sucesso" })
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });

    }


}

const listarSessoes = async (req, res) => {
    const { profissional } = req
    const { page, size } = req.query
    const now = new Date()

    try {

        if (page && size) {
            const sessoes = await knex('sessoes')
                .select(
                    's.id',
                    'p.nome as paciente',
                    'p.id as paciente_id',
                    's.data',
                    's.status',
                    's.tema',
                    's.duracao',
                    's.tipo'
                )
                .from('sessoes as s')
                .leftJoin('pacientes as p', 'p.id', 's.paciente_id')
                .orderBy('s.id', 'asc')
                .where('s.profissional_id', profissional.id)
                .offset((Number(page) - 1) * size)
                .limit(size)

            if (sessoes.length === 0) {
                return res.status(404).json({ "mensagem": "Nenhuma sessão encontrada" })
            }

            return res.status(200).json(sessoes)
        }

        if (size) {
            const sessoes = await knex('sessoes')
                .select(
                    's.id',
                    'p.nome as paciente',
                    'p.id as paciente_id',
                    's.data',
                    's.status',
                    's.tema',
                    's.duracao',
                    's.tipo'
                )
                .from('sessoes as s')
                .leftJoin('pacientes as p', 'p.id', 's.paciente_id')
                .orderBy('s.id', 'asc')
                .where('s.profissional_id', profissional.id)
                .offset(0)
                .limit(size)

            if (sessoes.length === 0) {
                return res.status(404).json({ "mensagem": "Nenhuma sessão encontrada" })
            }

            return res.status(200).json(sessoes)
        }

        if (page) {
            const sessoes = await knex('sessoes')
                .select(
                    's.id',
                    'p.nome as paciente',
                    'p.id as paciente_id',
                    's.data',
                    's.status',
                    's.tema',
                    's.duracao',
                    's.tipo'
                )
                .from('sessoes as s')
                .leftJoin('pacientes as p', 'p.id', 's.paciente_id')
                .orderBy('s.id', 'asc')
                .where('s.profissional_id', profissional.id)
                .offset((Number(page) - 1) * 6)
                .limit(6)

            if (sessoes.length === 0) {
                return res.status(404).json({ "mensagem": "Nenhuma sessão encontrada" })
            }

            return res.status(200).json(sessoes)
        }

        const sessoes = await knex('sessoes')
            .select(
                's.id',
                'p.nome as paciente',
                'p.id as paciente_id',
                's.data',
                's.status',
                's.tema',
                's.duracao',
                's.tipo'
            )
            .from('sessoes as s')
            .leftJoin('pacientes as p', 'p.id', 's.paciente_id')
            .orderBy('s.id', 'asc')
            .where('s.profissional_id', profissional.id)

        if (sessoes.length === 0) {
            return res.status(404).json({ "mensagem": "Nenhuma sessão encontrada" })
        }

        sessoes.map(async (item) => {
            if ((+new Date(item.data)) < +now && item.status === 'Agendado') {
                await knex('sessoes').update({
                    status: 'Expirado'
                }).where({ id: item.id })
            }
        })
        return res.status(200).json(sessoes)

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });

    }
}

const detalharSessao = async (req, res) => {
    const { profissional } = req
    const { id } = req.params

    try {
        const sessaoEncontrada = await knex('sessoes')
            .select(
                's.id',
                'p.nome as paciente',
                's.data',
                's.status',
                's.tema',
                's.duracao',
                's.tipo'
            )
            .from('sessoes as s')
            .leftJoin('pacientes as p', 'p.id', 's.paciente_id')
            .where('s.id', id)
            .andWhere('s.profissional_id', profissional.id)
            .first()

        if (!sessaoEncontrada) {
            return res.status(404).json({ "mensagem": "Sessão não encontrada" })
        }

        return res.status(200).json(sessaoEncontrada)

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });

    }
}

const atualizarSessao = async (req, res) => {
    const { id } = req.params;
    const { paciente_id, data, status, tema, duracao, tipo } = req.body;
    const { profissional } = req;

    try {
        schemaCadastroSessao.validate(req.body);

        const sessaoEncontrada = await knex('sessoes')
            .where({ id })
            .andWhere({ profissional_id: profissional.id });

        if (sessaoEncontrada.length === 0) {
            return res.status(404).json({ "mensagem": "Sessão não encontrada" });
        }

        const pacienteEncontrado = await knex('pacientes')
            .where({ id: paciente_id })
            .andWhere({ profissional_id: profissional.id });

        if (pacienteEncontrado.length === 0) {
            return res.status(404).json({ "mensagem": "Paciente não encontrado" });
        }


        const sessaoAtualizada = await knex('sessoes')
            .update({
                paciente_id,
                data,
                status,
                tema,
                duracao,
                tipo
            })
            .where({ id });

        if (sessaoAtualizada.length === 0) {
            return res.status(400).json({ "mensagem": "Não foi possível atualizar a sessão" });
        }

        return res.status(200).json({ "mensagem": "Sessão atualizada com sucesso" })

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });

    }
}

const deletarSessao = async (req, res) => {
    const { id } = req.params;
    const { profissional } = req;

    try {

        const sessaoEncontrada = await knex('sessoes')
            .where({ id })
            .andWhere({ profissional_id: profissional.id });

        if (sessaoEncontrada.length === 0) {
            return res.status(404).json({ "mensagem": "Sessão não encontrada" });
        }

        const sessaoDeletada = await knex('sessoes').del().where({ id });

        if (sessaoDeletada.length === 0) {
            return res.status(400).json({ "mensagem": "Não foi possível excluir a sessão" });
        }

        return res.status(200).json({ "mensagem": "Sessão excluída com sucesso" });

    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });

    }
}

const deletarSessoesDoPaciente = async (req, res) => {
    const { paciente_id } = req.params
    const { profissional } = req

    try {
        const sessoes = await knex('sessoes').where({ paciente_id })

        const sessoesDeletadas = await knex('sessoes').del().where({ paciente_id })

        if (sessoesDeletadas.length === 0) {
            return res.status(404).json({ "mensagem": "Não foi possível deletar as sessoes" })

        }

        res.status(200).json({ "mensagem": "Sessões excluídas com sucesso" })
    } catch (error) {
        return res.status(500).json({ "mensagem": error.message });

    }
}

module.exports = {
    cadastroSessao,
    listarSessoes,
    detalharSessao,
    atualizarSessao,
    deletarSessao,
    deletarSessoesDoPaciente
}