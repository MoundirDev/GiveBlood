const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },

    bloodRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
    },
    
    bloodType: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },

    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment =  mongoose.model('Appointment', appointmentSchema);