const { Produto } = require('../models/rel')

async function criarProduto(dados) {

    const { nome, descricao, modelo, preco, imagem_url, ativo } = dados

    // Validações simples antes de salvar
    if (!nome || !modelo || !preco) {
        throw new Error('Nome, modelo e preço são obrigatórios!')
    }

    const novoProduto = await Produto.create({
        nome,
        descricao,
        modelo,
        preco,
        imagem_url,
        ativo
    })

    return novoProduto
}


const listarProdutos = async () => {
    try {
        const produtos = await Produto.findAll();

        return produtos;
    } catch (error) {
        console.error("Erro no ProdutoService.listarProdutos:", error);
        throw new Error("Erro ao listar produtos!");
    }
};

async function atualizarProduto(id, dados) {

    // Buscar o produto no banco
    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado!')
    }

    // Atualizar apenas os campos enviados
    await produto.update(dados)

    return produto

}

async function apagarProduto(id) {

    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado!')
    }

    await produto.destroy()

    return true
}


module.exports = { criarProduto, listarProdutos, atualizarProduto, apagarProduto }