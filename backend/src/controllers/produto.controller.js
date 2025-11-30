const { criarProduto, listarProdutos, 
    atualizarProduto, atualizarProdutoCompleto,
    apagarProduto } = require('../services/produto.service')

// Função auxiliar para tratar erros e padronizar resposta
function tratarErro(res, err) {
    console.error('Erro no controller de produto:', err)

    // Se o service lançar um erro com statusCode, respeitamos
    const status = err && err.statusCode ? err.statusCode : 400
    const message = err && err.message ? err.message : 'Erro ao processar a requisição'

    return res.status(status).json({ message })
}

async function criar(req, res) {
    try {
        const produto = await criarProduto(req.body)

        return res.status(201).json({
            message: 'Produto criado com sucesso',
            produto
        })

    } catch (err) {
        return tratarErro(res, err)
    }
}

async function listar(req, res) {
    try {
        const produtos = await listarProdutos()

        return res.status(200).json(produtos)

    } catch (err) {
        return tratarErro(res, err)
    }
}

// Atualizar parcialmente produto (PATCH /produto/:id)
async function atualizar(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const produtoAtualizado = await atualizarProduto(id, dados)

        return res.status(200).json({
            message: 'Produto atualizado com sucesso',
            produto: produtoAtualizado
        })

    } catch (err) {
        return tratarErro(res, err)
    }

}

// PUT - Atualização total
async function atualizarCompleto(req, res) {
    try {
        const { id } = req.params
        const dados = req.body

        const produtoAtualizado = await atualizarProdutoCompleto(id, dados)

        return res.status(200).json({
            message: 'Produto atualizado completamente com sucesso',
            produto: produtoAtualizado
        })

    } catch (err) {
        return tratarErro(res, err)
    }
}

// DELETE - apagar
async function deletar(req, res) {
    try {
        const { id } = req.params

        await apagarProduto(id)

        return res.status(200).json({ message: 'Produto apagado com sucesso' })

    } catch (err) {
        return tratarErro(res, err)
    }
}

module.exports = { criar, listar, atualizar, 
    atualizarCompleto, deletar }
