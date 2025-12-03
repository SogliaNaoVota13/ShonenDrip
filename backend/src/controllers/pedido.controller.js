// controllers/pedido.controller.js
const PedidoService = require('../services/pedido.service');

/**
 * Normaliza e valida o array de itens recebido do front.
 * Aceita:
 * - itens: [{ codProduto, quantidade, preco }]
 * - itens: [{ id, qtd, preco }]
 * - carrinho: same as above
 */
function normalizarItens(raw) {
    if (!raw) return [];

    // se veio objeto com chave 'carrinho' ou 'items'
    if (raw.carrinho) raw = raw.carrinho;
    if (raw.items) raw = raw.items;

    // se enviaram um objeto único (não array)
    if (!Array.isArray(raw)) return [];

    const out = raw.map(item => {
        // vários formatos possíveis do front — normalize:
        const codProduto = item.codProduto ?? item.id ?? item.produtoId ?? item.produto_id;
        const quantidade = Number(item.quantidade ?? item.qtd ?? item.qty ?? item.quantidadeItem ?? 0);
        const preco = Number(item.preco ?? item.precoUnitario ?? item.price ?? item.valor ?? 0);

        return {
            codProduto,
            quantidade,
            preco
        };
    });

    // filtrar inválidos
    return out.filter(i => i.codProduto && i.quantidade > 0);
}

module.exports = {
    async criar(req, res) {
        try {
            // LOGs úteis — colocados no topo da função
            console.log("📦 BODY RECEBIDO NO BACKEND:", req.body);
            console.log("👤 USUÁRIO DO TOKEN (req.user):", req.user);

            // pegar id do usuário vindo do token (tenta várias chaves)
            const idUsuario = req.user?.codUsuario ?? req.user?.id ?? req.body?.idUsuario;
            if (!idUsuario) {
                return res.status(401).json({ erro: 'Usuário não identificado no token' });
            }

            // normaliza itens (aceita vários formatos)
            const rawItens = req.body.itens ?? req.body.carrinho ?? req.body.items ?? req.body.lista;
            const itens = normalizarItens(rawItens);
            const valorFrete = Number(req.body.valorFrete ?? 0);

            // chama service
            const pedido = await PedidoService.criarPedido(idUsuario, itens, valorFrete);

            return res.status(201).json({
                mensagem: "Pedido criado com sucesso",
                pedido
            });

        } catch (error) {
            console.error("Erro no controller criar pedido:", error);
            return res.status(400).json({ erro: error.message || 'Erro ao criar pedido' });
        }
    },

    async listar(req, res) {
        try {
            const idUsuario = req.user?.codUsuario ?? req.user?.id;
            if (!idUsuario) return res.status(401).json({ erro: 'Usuário não identificado' });

            const pedidos = await PedidoService.listarPedidos(idUsuario);
            return res.json(pedidos);
        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            return res.status(400).json({ erro: error.message });
        }
    }
};
