const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const utilisateurSchema = new mongoose.Schema({

  nom: {
    type: String,
    required: true
  },

  nom_complet: {
    type: String,
    required: true
    // "Full name" dans la page 4
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['donneur','admin'],
    default: 'donneur'
  },

  groupe_sanguin: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    // "Blood type" dans la page 4
  },

  ville: {
    type: String
    // "City" dans la page 4
  },

  localisation: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    ville: String,
    wilaya:  {
        type: String,
        enum: [
            'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi',
            'Batna', 'Béjaïa', 'Biskra', 'Béchar',
            'Blida', 'Bouira', 'Tamanrasset', 'Tébessa',
            'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
            'Djelfa', 'Jijel', 'Sétif', 'Saïda',
            'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
            'Constantine', 'Médéa', 'Mostaganem', 'MSila',
            'Maascar', 'Ouargla', 'Oran', 'El Bayadh',
            'Illizi', 'Bordj Bou Arréridj', 'Boumerdès',
            'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
            'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila',
            'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa',
            'Relizane', 'Timimoun', 'Bordj Badji Mokhtar',
            'Ouled Djellal', 'Béni Abbès', 'In Salah',
            'In Guezzam', 'Touggourt', 'Djanet',
            'El MGhair', 'El Meniaa'
        ]
    },
},
  

  disponible: {
    type: Boolean,
    default: true 
  }

 },  { timestamps: true });

utilisateurSchema.index({ localisation: '2dsphere' });

utilisateurSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return ;
  this.password = await bcrypt.hash(this.password, 10);
  
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);