let nomeUsuario = document.getElementById('nomeUsuario')
let btnLogout = document.getElementById('btnLogout')
let resListar = document.getElementById('resListar')

console.log(nomeUsuario)

let token = sessionStorage.getItem('token')

if (!token) {
    location.href = '../index.html'
}

onload = () => {
    fetch(`http://localhost:3000/produto`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Erro ao listar produtos!");
            }
            return resp.json();
        })
        .then(dados => {
            resListar.innerHTML = ``
            dados.sort((a, b) => a.nome.localeCompare(b.nome))
            resListar.innerHTML += `<table>${gerarTabela(dados)}</table>`
        })
        .catch((err) => {
            console.log('Falha ao listar os produtos!', err)
            resListar.innerHTML += err.message
        })
}

let btnAtualizarProduto = document.getElementById('btnAtualizarProduto')

btnAtualizarProduto.addEventListener('click', (e) => {
    e.preventDefault()

    let codProduto = Number(document.getElementById('codProduto').value)
    let nome = document.getElementById('nome').value
    let descricao = document.getElementById('descricao').value
    let modelo = document.getElementById('modelo').value
    let preco = document.getElementById('preco').value
    let imagem_url = document.getElementById('imagem_url').value

    const dados = {
        nome: nome,
        descricao: descricao,
        modelo: modelo,
        preco: preco,
        imagem_url: imagem_url
    }

    for (let key in dados) {
        if (dados[key] === "" || dados[key] === null) {
            delete dados[key];
        }
    }

    fetch(`http://localhost:3000/produto/${codProduto}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })
        .then(resp => resp.json().then(body => {
            if (!resp.ok) throw new Error(body.message);
            return body;
        }))

        .then(dados => {
            alert(dados.message)
            document.querySelector('form').reset()
            onload()
        })
        .catch((err) => {
            console.error('Falha ao atualizar produto!', err)
            alert(err.message)
        })
})

let btnDelete = document.getElementById('btnDelete')

document.getElementById('formDelete').addEventListener('submit', (e) => {
    e.preventDefault()

    let codDelete = Number(document.getElementById('codDelete').value)

    if (!codDelete) {
        alert("Informe um código válido!")
        return
    }

    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    fetch(`http://localhost:3000/produto/${codDelete}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(resp => resp.json().then(body => {
            if (!resp.ok) throw new Error(body.message);
            return body;
        }))
        .then(() => {
            alert(dados.message)
            document.getElementById('formDelete').reset()
            onload() // atualiza a tabela
        })
        .catch(err => {
            console.error('Erro ao apagar produto!', err)
            alert(err.message)
        })
})

let btnMovimentar = document.getElementById('btnMovimentar')

btnMovimentar.addEventListener('click', (e) => {
    e.preventDefault()

    let idProduto = Number(document.getElementById('idProduto').value)
    let tipo = document.getElementById('tipo').value
    let qtdeMovimento = Number(document.getElementById('qtdeMovimento').value)

    const dados = {
        idProduto: idProduto,
        tipo: tipo,
        qtdeMovimento: qtdeMovimento
    }

    fetch('http://localhost:3000/estoque', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })
        .then(resp => resp.json().then(body => {
            if (!resp.ok) throw new Error(body.message);
            return body;
        }))
        .then(dados => {
            alert('Dados movimentados com sucesso!')
            onload()
        })
        .catch((err) => {
            console.error('Erro ao movimentar estoque!', err)
            alert('Erro ao movimentar estoque!')
        })
})


btnLogout.addEventListener('click', (e) => {
    e.preventDefault()

    sessionStorage.clear()
    location.href = '../index.html'
})

function gerarTabela(dados) {
    let tab = `
        <thead>
            <th>Código</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Modelo</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Imagem (link)</th>
        </thead>
    `

    tab += `<tbody>`

    dados.forEach(dad => {
        tab += `
            <tr>
                <td>${dad.codProduto}</td>
                <td>${dad.nome}</td>
                <td>${dad.descricao || '-'}</td>
                <td>${dad.modelo}</td>
                <td>R$ ${Number(dad.preco).toFixed(2)}</td>
                <td>${dad.estoque}</td>
                <td>
                    <img src="${dad.imagem_url}" style="width:80px; object-fit:cover; border-radius:6px;">
                </td>
            </tr>
        `
    })

    tab += `</tbody>`

    return tab
}