const mongoose = require('mongoose');

const demandeSangSchema = new mongoose.Schema({
  hopital_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Hopital', required: true },
  groupe_sanguin: { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'], required: true },
  quantite:       { type: Number, required: true },
  urgence:        { type: Boolean, default: false },
  localisation: {
    type:        { type: String, default: 'Point' },
    coordinates: [Number],
    ville:       String,
    wilaya:      String
  },
  status: { type: String, enum: ['ouverte','satisfaite','fermee'], default: 'ouverte' },
  date:   { type: Date, default: Date.now }
}, { timestamps: true });

demandeSangSchema.index({ localisation: '2dsphere' });
module.exports = mongoose.model('DemandeSang', demandeSangSchema);