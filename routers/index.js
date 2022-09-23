const Router = require('express')
const bookRouter = require('./bookRouter')
const userRouter = require('./userRouter')
const poolRouter = require('./poolRouter')
const adminRouter = require('./adminRouter')
const router = new Router()

router.use('/user', userRouter)
router.use('/book', bookRouter)
router.use('/pool', poolRouter)
router.use('/admin',adminRouter)


module.exports = router