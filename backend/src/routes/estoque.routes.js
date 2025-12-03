const express = require('express')
const router = express.Router()

const { movimentar } = require('../controllers/estoque.controller')

const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    movimentar
)

module.exports = router