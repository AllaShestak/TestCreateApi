const {Pool, Book} = require('../models/models')
const ApiError = require('../error/ApiError');
const userController = require("./userController");

class PoolController {

    async getAll(req, res, next) {
       /* try {
            const { token} = req.body
            if (!token) {
                return next(ApiError.badRequest("User or Admin not authorized"))
            }
            const books = await Book.findAll();
            res.json(books)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
*/
    }
    async getRented(req, res, next) {
        try {
            const {id, token} = req.body
            if (!token) {
                return next(ApiError.badRequest("User or Admin not authorized"))
            }

            const books = await Book.findAll();
            res.json(books)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }


}

module.exports = new PoolController()