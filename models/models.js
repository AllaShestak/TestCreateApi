const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    login: {type: DataTypes.STRING, unique: true, defaultValue: "USER"},
})

const Admin = sequelize.define('admin', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    login: {type: DataTypes.STRING, unique: true, defaultValue: "ADMIN"},
})


const Pool = sequelize.define('pool', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Book = sequelize.define('book', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    ISBN: {type: DataTypes.STRING, unique: true, allowNull: false},
    author: {type: DataTypes.STRING},
})

User.hasMany(Book)
Book.belongsTo(User)

Pool.hasMany(Book)
Book.belongsTo(Pool)

module.exports = {
    User,
    Book,
    Pool,
    Admin
}