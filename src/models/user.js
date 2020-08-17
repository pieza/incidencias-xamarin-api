const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require("bcrypt")

const UserSchema = new Schema({
    identification: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    lastname1: { type: String, required: true },
    lastname2: { type: String },
    province: { type: String },
    canton: { type: String },
    district: { type: String },
    direction: { type: String },
    activation_number: { type: Number },
    active: { type: Boolean, default: false }
})

/**
 * Encrypt a string and return the hash.
 * 
 * @param {Sring} password actual password to encrypt.
 * @return encrypted password.
 */
UserSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

/**
 * Compares if a text is valid for the hash.
 * 
 * @param {String} password text to compare with original password.
 * @return true if password is valid.
 */
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)