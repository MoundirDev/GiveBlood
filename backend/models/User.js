import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true
  },

  fullname: {
    type: String,
    required: true
    // "Full name" (page 4)
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
    enum: ['donor', 'admin'],
    default: 'donor'
  },

  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    // "Blood type" (page 4)
  },

  city: {
      type: String,
      enum: [
        'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi',
        'Batna', 'Bejaia', 'Biskra', 'Bechar',
        'Blida', 'Bouira', 'Tamanrasset', 'Tebessa',
        'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers',
        'Djelfa', 'Jijel', 'Setif', 'Saida',
        'Skikda', 'Sidi Bel Abbes', 'Annaba', 'Guelma',
        'Constantine', 'Medea', 'Mostaganem', 'MSila',
        'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
        'Illizi', 'Bordj Bou Arreridj', 'Boumerdes',
        'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
        'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila',
        'Ain Defla', 'Naama', 'Ain Temouchent', 'Ghardaia',
        'Relizane', 'Timimoun', 'Bordj Badji Mokhtar',
        'Ouled Djellal', 'Beni Abbes', 'In Salah',
        'In Guezzam', 'Touggourt', 'Djanet',
        'El Mghair', 'El Meniaa'
      ]
    },

  available: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model('User', userSchema);