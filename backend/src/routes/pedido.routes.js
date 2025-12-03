const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/pedido.controller');
const authController = require('../middlewares/auth.middleware')

router.post('/criar', authController, PedidoController.criar);
router.get('/meus-pedidos', authController, PedidoController.listar);

module.exports = router;
