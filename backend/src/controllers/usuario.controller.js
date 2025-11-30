const usuarioService = require('../services/usuario.service')

async function cadastrar(req, res) {
    try {
        const dados = req.body

        await usuarioService.cadastrar(dados)

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso'
        })

    } catch (err) {
        console.error('Erro no controller de cadastro:', err)

        return res.status(400).json({
            message: err.message || 'Erro ao cadastrar usuário'
        })
    }
}


module.exports = { cadastrar }
