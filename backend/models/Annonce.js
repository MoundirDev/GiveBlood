const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({

  utilisateur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },

  titre: {
    type: String,
    required: true
  },

  nom_organisation: {
    type: String,
    required: true
    // "Name of Organization" dans la page 6
  },

  email_professionnel: {
    type: String,
    required: true
    // "Professional Email" dans la page 6
  },

  description: {
    type: String
  },

  date: {
    type: Date,
    required: true
    // "Collection Date" dans la page 6
  },

  heure: {
    type: String
    // "Hour" dans la page 6
  },

  event_link: {
    type: String
    // "Event Link (Optional)" dans la page 6
  },

  valide: {
    type: Boolean,
    default: false
    // false = en attente validation admin
  }

}, { timestamps: true });

module.exports = mongoose.model('Annonce', annonceSchema);