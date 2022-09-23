const {Book, Pool} = require('../models/models')
const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')


class BookController {
    async create(req, res, next) {
        try {
            const {name, ISBN, author, token, poolId} = req.body

            if (!token) {
                return next(ApiError.badRequest("Admin not authorized"))
            }
            const token_validation = await adminController.tokenVerify(token)
            if (!token_validation) {
                return next(ApiError.badRequest("Admin not authorized"))
            }
            if (!poolId) {
                return next(ApiError.badRequest("PoolId is wrong"))
            }
            const poolControl = await Pool.findOne({where: {id: poolId}})
            if (!poolControl) {
                await Pool.create({id: poolId})
            }
            const book = await Book.create({name, ISBN, author, poolId})
            return res.json(book)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const {token} = req.body
            if (!token) {
                return next(ApiError.badRequest("User or Admin not authorized"))
            }
            const token_validationAdmin = await adminController.tokenVerify(token)
            const token_validationUser = await userController.tokenVerify(token)
            if (!token_validationAdmin && !token_validationUser) {
                return next(ApiError.badRequest("User or Admin not authorized"))
            }
            const books = await Book.findAll();
            return res.json(books)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async findAll(req, res, next) {
        try {
            const {token} = req.body
            if (!token) {
                return next(ApiError.badRequest("User or Admin not authorized"))
            }
            const token_validationAdmin = await adminController.tokenVerify(token)
            const token_validationUser = await userController.tokenVerify(token)
            if (!token_validationAdmin && !token_validationUser) {
                return next(ApiError.badRequest("User or Admin not authorized"))
            }
            const books = await Book.findAll({where: {userId: null}});
            return res.json(books)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id, token} = req.body
            if (!token) {
                return next(ApiError.badRequest("Admin not authorized"))
            }
            const token_validation = await adminController.tokenVerify(token)
            if (!token_validation) {
                return next(ApiError.badRequest("Admin not authorized"))
            }
            const deletePool = await Book.findByPk(id)
            deletePool.poolId = null
            /* await Book.destroy({where: {id}})
            *  return res.json({result: true})
            * */
            await deletePool.save()
            return res.json(deletePool)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateOne(req, res, next) {
        try {
            const {id, name, ISBN, author, token} = req.body
            if (!token) {
                return next(ApiError.badRequest("Admin not authorized"))
            }
            const token_validation = await adminController.tokenVerify(token)
            if (!token_validation) {
                return next(ApiError.badRequest("Admin not authorized"))
            }
            const updateBook = await Book.findByPk(id)
            updateBook.name = name
            updateBook.ISBN = ISBN
            updateBook.author = author
            await updateBook.save()

            return res.json(updateBook)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getRented(req, res, next) {
        try {
            const {id, token} = req.body
            if (!token) {
                return next(ApiError.badRequest("User or Admin not authorized"))
            }
            const token_validation = await userController.tokenVerify(token)
            if (!token_validation) {
                return next(ApiError.badRequest("User not authorized"))
            }
            const books = await Book.findByPk(id);
            if (books.userId !== null) {
                return next(ApiError.badRequest("Book is not available"))
            }
            const user = jwt.verify(token, process.env.SECRET_KEY)
            books.userId = user.id
            await books.save()
            return res.json(books)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async returnRented(req, res, next) {
        try {
            const {id, token} = req.body
            if (!token) {
                return next(ApiError.badRequest("User or Admin not authorized"))
            }
            const token_validation = await userController.tokenVerify(token)
            if (!token_validation) {
                return next(ApiError.badRequest("User not authorized"))
            }
            const books = await Book.findByPk(id);
            const user = jwt.verify(token, process.env.SECRET_KEY)
            if (books.userId !== user.id) {
                return next(ApiError.badRequest("You cannot return this book"))
            }
            books.userId = null
            await books.save()
            return res.json(books)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
}

module.exports = new BookController()