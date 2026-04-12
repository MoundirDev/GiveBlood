const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  destinataire_id:   { type: mongoose.Schema.Types.ObjectId, required: true },
  destinataire_role: { type: String, enum: ['donneur','hopital','admin'] },
  message:           { type: String, required: true },
  lu:                { type: Boolean, default: false },
  date:              { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);