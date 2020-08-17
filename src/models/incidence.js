const mongoose = require('mongoose')
const { Schema } = mongoose

const IncidenceSchema = new Schema({
    description: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    type: { type: String, required: true },
    company: { type: String, required: true },
    photo: { type: String },
    province: { type: String },
    canton: { type: String },
    district: { type: String },
    direction: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
})

module.exports = mongoose.model('Incidence', IncidenceSchema)