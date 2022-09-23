const ApiError = require('../error/ApiError');
const {Admin} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwt = (id, login) => {
    return jwt.sign(
        {id, login},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class AdminController {
    async registration(req, res, next) {
        const {id, name, password, login} = req.body
        if (!login || !password) {
            return next(ApiError.badRequest("Login or password is wrong"))
        }
        const candidate = await Admin.findOne({where: {login}})
        if (candidate) {
            return next(ApiError.badRequest("User with this name exists"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const admin = await Admin.create({id, name, login, password: hashPassword})
        const token = generateJwt(admin.id, admin.login)
        return res.json({token})
    }

    async login(req, res, next) {
        const {login, password} = req.body
        if (!login || !password) {
            return next(ApiError.badRequest("Login or password is wrong"))
        }

        const admin = await Admin.findOne({where: {login}})
        if (!admin) {
            return next(ApiError.badRequest("Login or password is wrong"))
        }
        let comparePassword = bcrypt.compareSync(password, admin.password)
        if (!comparePassword) {
            return next(ApiError.badRequest("Login or password is wrong"))
        }
        const token = generateJwt(admin.id, admin.login)
        return res.json({token})

    }

    async tokenVerify(token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const login = decoded.login

        const admin = await Admin.findOne({where: {login}})
        if (!admin) {
            return false
        }

        return admin.id === decoded.id
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.name, req.user.login)
        return res.json({token})
    }
}

module.exports = new AdminController()