const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        unique: true,
        required: true
    },
    wallet: {
        type: Number,
        default: 0
    },
    cooldowns: {
        work: {
            type: Date
        },
        daily: {
            type: Date
        }
    },
})

const User = module.exports = { User: mongoose.model('User', UserSchema) }