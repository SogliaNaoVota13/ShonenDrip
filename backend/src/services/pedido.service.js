const Pedido = require('../models/Pedido');
const ItemPedido = require('../models/ItemPedido');

module.exports = {
    async criarPedido(idUsuario, itens, valorFrete = 0) {

        if (!itens || itens.length === 0) {
            throw new Error("O carrinho está vazio.");
        }

        // Calcular subtotal
        let subtotal = 0;
        itens.forEach(item => {
            subtotal += (item.preco * item.quantidade);
        });

        const valorTotal = subtotal + valorFrete;

        // Criar pedido
        const pedido = await Pedido.create({
            idUsuario,
            valorSubtotal: subtotal,
            valorFrete,
            valorTotal
        });

        // Criar itens do pedido
        for (const item of itens) {
            await ItemPedido.create({
                idPedido: pedido.codPedido,
                idProduto: item.codProduto,
                quantidade: item.quantidade,
                precoUnitario: item.preco,
                valorTotalItem: item.preco * item.quantidade
            });
        }

        return pedido;
    },

    async listarPedidos(idUsuario) {
        return await Pedido.findAll({
            where: { idUsuario },
            include: [{ model: ItemPedido }]
        });
    }
};
