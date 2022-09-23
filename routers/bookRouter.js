const Router = require('express')
const router = new Router()
const bookController = require('../controllers/bookController')

router.post('/',bookController.create)
router.get('/', bookController.getAll)
router.get('/rent', bookController.findAll)
router.put('/', bookController.updateOne)
router.delete('/', bookController.deleteOne)
router.post('/rent', bookController.getRented)
router.delete('/rent', bookController.returnRented)
module.exports = router