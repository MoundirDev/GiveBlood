const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const hopitalSchema = new mongoose.Schema({
  nom:      { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  localisation: {
    type:        { type: String, default: 'Point' },
    coordinates: [Number],
    ville:       String,
    wilaya:      String
  },
  valide:    { type: Boolean, default: false },
  validePar: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
}, { timestamps: true });

hopitalSchema.index({ localisation: '2dsphere' });

hopitalSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return ;
  this.password = await bcrypt.hash(this.password, 10);
  
});
module.exports = mongoose.model('Hopital', hopitalSchema);