const mongoose = require('mongoose');

const rdvSchema = new mongoose.Schema({
  donneur_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  hopital_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital',     required: true },
  demande_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'DemandeSang' },
  date:        { type: Date, required: true },
  status:      { type: String, enum: ['en_attente','confirme','annule'], default: 'en_attente' },
  confirmerPar:{ type: mongoose.Schema.Types.ObjectId, ref: 'Hopital' }
}, { timestamps: true });

module.exports = mongoose.model('RDV', rdvSchema);