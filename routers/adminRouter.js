const Router = require('express')
const router = new Router()
const adminController = require('../controllers/AdminController')

router.post('/registration', adminController.registration)
router.post('/login',adminController.login)
router.get('/auth', adminController.check)

module.exports = router
