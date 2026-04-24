import mongoose from "mongoose";
import bcrypt from "bcrypt";

const hospitalSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  address: {
    type: String,
    required: true
  },

  isValid:   { type: Boolean, default: false },
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

hospitalSchema.index({ location: '2dsphere' });

hospitalSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});


export const Hospital = mongoose.model('Hospital', hospitalSchema);