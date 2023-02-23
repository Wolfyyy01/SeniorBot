const mongoose = require('mongoose')

const WelcomeSchema = new mongoose.Schema({
    GuildId: String,
    Channel: String
})

module.exports = mongoose.model('Welcome', WelcomeSchema)