import mongoose from "mongoose";
import bcrypt from "bcrypt";

const hospitalSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  location: {
    type:        { type: String, default: 'Point' },
    coordinates: [Number],
    city:        String,
    state:       String
  },

  isValid:   { type: Boolean, default: false },
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

hospitalSchema.index({ location: '2dsphere' });

hospitalSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const Hospital = mongoose.model('Hospital', hospitalSchema);