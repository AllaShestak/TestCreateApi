const ApiError = require('../error/ApiError');
const {User, Admin} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwt = (id, login) => {
    return jwt.sign(
        {id, login},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {id, name, password, login} = req.body
        if (!login || !password) {
            return next(ApiError.badRequest("Login or password is wrong"))
        }
        const candidate = await User.findOne({where: {login}})
        if (candidate) {
            return next(ApiError.badRequest("User with this name exists"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({id, name, login, password: hashPassword})
        const token = generateJwt(user.id, user.login)
        return res.json({token})
    }

    async login(req, res, next) {
        const {login, password} = req.body
        if (!login || !password) {
            return next(ApiError.badRequest("Login or password is wrong"))
        }

        const user = await User.findOne({where: {login}})
        if (!user) {
            return next(ApiError.badRequest("Login or password is wrong"))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest("Login or password is wrong"))
        }
        const token = generateJwt(user.id, user.login)
        return res.json({token})

    }

    async tokenVerify(token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const login = decoded.login

        const user = await User.findOne({where: {login}})
        if (!user) {
            return false
        }

        return user.id === decoded.id
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.name, req.user.login)
        return res.json({token})
    }
}

module.exports = new UserController()