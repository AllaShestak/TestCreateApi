const Router = require('express')
const poolController = require('../controllers/poolController')
const router = new Router()


router.get('/', poolController.getAll)
router.post('/',poolController.getRented)


module.exports = router