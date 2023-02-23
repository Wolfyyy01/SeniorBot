const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    GuildId: String,
    Channel: String,
    Ticcket: String
})

module.exports = mongoose.model('Ticket', TicketSchema)