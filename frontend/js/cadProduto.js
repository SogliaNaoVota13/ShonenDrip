// Elementos da interface
const nomeUsuario = document.getElementById('nomeUsuario');
const btnLogout = document.getElementById('btnLogout');
const btnCadProduto = document.getElementById('btnCadProduto');

// Token salvo da sessão (controle de login)
const token = sessionStorage.getItem('token');

// Se não estiver logado, manda pra página inicial
if (!token) {
    window.location.href = '../index.html';
}

// Cadastro de produto
btnCadProduto.addEventListener('click', (e) => {
    e.preventDefault();

    // Pegando valores do formulário
    const produto = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        modelo: document.getElementById('modelo').value,
        preco: document.getElementById('preco').value,
        imagem_url: document.getElementById('imagem_url').value
    };

    // Enviando produto pro backend
    fetch('http://localhost:3000/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(produto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Não foi possível cadastrar o produto.');
        }
        return response.json();
    })
    .then(result => {
        alert(result.message);
        
        // Limpa formulário para evitar bagunça
        document.querySelector('form').reset();

        // Redireciona depois de cadastrar
        setTimeout(() => {
            window.location.href = './gerProduto.html';
        }, 1500);
    })
    .catch(error => {
        console.error('Erro no cadastro:', error);
        alert(error.message);
    });
});

// Pegando dados do usuário salvos na sessão
const nomeSalvo = sessionStorage.getItem('nome');
const tipoUsuario = sessionStorage.getItem('tipo');

// Mostra o nome na interface
if (nomeUsuario && nomeSalvo) {
    nomeUsuario.textContent = nomeSalvo;
}

// Função de logout
btnLogout.addEventListener('click', (e) => {
    e.preventDefault();

    sessionStorage.clear();   // limpa tudo da sessão
    window.location.href = '../index.html'; // volta pro login
});
