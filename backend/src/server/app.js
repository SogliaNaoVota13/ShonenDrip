const express = require('express')
const cors = require('cors')

const app = express()

// ------------------ Middlewares globais ------------------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// ------------------ Rotas ------------------
const usuarioRoutes = require('../routes/usuario.routes')
const authRoutes = require('../routes/auth.routes')
const estoqueRoutes = require('../routes/estoque.routes')
const produtoRoutes = require('../routes/produto.routes')
const pedidoRoutes = require('../routes/pedido.routes')

app.use('/usuario', usuarioRoutes)
app.use('/', authRoutes)
app.use('/estoque', estoqueRoutes)
app.use('/produto', produtoRoutes)
app.use('/pedidos', pedidoRoutes)


app.get('/', (req, res) => {
    res.status(200).json({message: 'API funcionando!'})
})

module.exports = app
