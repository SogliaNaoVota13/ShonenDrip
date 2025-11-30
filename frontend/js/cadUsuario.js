let btnCadUsuario = document.getElementById('btnCadUsuario')

btnCadUsuario.addEventListener('click', (e) => {
    e.preventDefault()

    let nome = document.getElementById('nome').value
    let email = document.getElementById('email').value
    let telefone = document.getElementById('telefone').value
    let cpf = document.getElementById('cpf').value
    let identidade = document.getElementById('identidade').value
    let senha = document.getElementById('senha').value

    const dados = {
        nome: nome,
        email: email,
        telefone: telefone,
        cpf: cpf,
        identidade: identidade,
        senha: senha
    }

    fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
        .then(resp => {
           window.alert('Shinobi cadastrado com sucesso!')
        })
        .then(dados => {

            setTimeout(() => {
                window.location = '../index.html'
            }, 2000)
        })
        .catch((err) => {
            console.error('Falha ao cadastrar Shinobi!', err)
            alert(err.message)
        })
})