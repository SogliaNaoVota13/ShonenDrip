// =========================
//   FILTRAGEM E PESQUISA 
// =========================
const searchInput = document.getElementById('searchInput');
const priceFilter = document.getElementById('priceFilter');
const productGrid = document.getElementById('productGrid');

// =========================
//   SIDEBAR DO CARRINHO
// =========================
let sideCart = document.getElementById('sideCart');
let btnCarrinho = document.getElementById('btnCarrinho');
let closeCart = document.getElementById('closeCart');
let cartItems = document.getElementById('cartItems');
let cartTotal = document.getElementById('cartTotal');
let btnFinalizar = document.querySelector('.finalizar');

// Carregar carrinho salvo
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// ABRIR CARRINHO
btnCarrinho.addEventListener('click', () => {
    sideCart.style.right = "0px";
});

// FECHAR CARRINHO
closeCart.addEventListener('click', () => {
    sideCart.style.right = "-350px";
});

// SALVAR CARRINHO LOCALSTORAGE
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// ADICIONAR AO CARRINHO (agora seguro)
function adicionarAoCarrinho(produto) {
    let existente = carrinho.find(p => p.codProduto === produto.codProduto);

    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({
            codProduto: produto.codProduto,
            nome: produto.nome,
            preco: Number(produto.preco),
            imagem_url: produto.imagem_url,
            quantidade: 1
        });
    }

    salvarCarrinho();
    renderCarrinho();
}

// REMOVER ITEM
function removerItem(id) {
    carrinho = carrinho.filter(item => item.codProduto !== id);
    salvarCarrinho();
    renderCarrinho();
}

// RENDERIZAR CARRINHO
function renderCarrinho() {
    cartItems.innerHTML = "";
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem_url}">
                <div>
                    <p>${item.nome}</p>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                    <small>Qtd: ${item.quantidade}</small>
                </div>
                <button onclick="removerItem(${item.codProduto})">🗑</button>
            </div>
        `;
    });

    cartTotal.innerText = total.toFixed(2);
}

renderCarrinho();

// =========================
//   VALIDAÇÃO DE SESSÃO
// =========================
let token = sessionStorage.getItem('token');
let nome = sessionStorage.getItem('nome');
let tipo = sessionStorage.getItem('tipo');

if (!token) {
    location.href = '../index.html';
}

if (tipo === 'ADMIN') {
    location.href = './painelAdm.html';
}

let nomeUsuario = document.getElementById('nomeUsuario');
let btnLogout = document.getElementById('btnLogout');

if (nomeUsuario) nomeUsuario.textContent = nome;

// LOGOUT
btnLogout.addEventListener("click", e => {
    e.preventDefault();
    sessionStorage.clear();
    localStorage.clear();
    alert('Logout efetuado com sucesso!');
    location.href = '../index.html';
});

// =========================
//   CARREGAR PRODUTOS DA API
// =========================
let produtos = [];

fetch('http://localhost:3000/produto', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
.then(resp => resp.json())
.then(data => {
    produtos = data;

    productGrid.innerHTML = "";

    data.forEach(prod => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.dataset.price = prod.preco;

        card.innerHTML = `
            <img src="${prod.imagem_url}" alt="${prod.nome}">
            <h3>${prod.nome}</h3>
            <p class="price">R$ ${Number(prod.preco).toFixed(2)}</p>
            <button class="buy-btn">Adicionar ao Carrinho</button>
        `;

        // Agora adiciona corretamente ao carrinho
        card.querySelector('.buy-btn').addEventListener('click', () => {
            adicionarAoCarrinho(prod);
        });

        productGrid.appendChild(card);
    });
});

// =========================
//   FINALIZAR COMPRA (corrigido)
// =========================
btnFinalizar.addEventListener('click', async () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const resposta = await fetch('http://localhost:3000/pedidos/criar', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            itens: carrinho,
            valorFrete: 0
        })
    });

    const data = await resposta.json();
    console.log("RESPOSTA PEDIDO =>", data);

    if (resposta.ok) {
        alert("Pedido salvo com sucesso!");
        carrinho = [];
        salvarCarrinho();
        renderCarrinho();
        location.href = "./entrega.html";
    } else {
        alert("Erro ao salvar pedido: " + data.erro);
    }
});

// =========================
//   PESQUISA
// =========================
searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();

    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = name.includes(term) ? '' : 'none';
    });
});

// =========================
//   FILTRO POR PREÇO
// =========================
priceFilter.addEventListener('change', () => {
    let cards = Array.from(document.querySelectorAll('.product-card'));
    const value = priceFilter.value;

    if (value !== 'default') {
        cards.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            return value === 'min' ? priceA - priceB : priceB - priceA;
        });

        cards.forEach(c => productGrid.appendChild(c));
    }
});
