import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organizationName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    hour: {
      type: String,
      requried: true
    },

    eventLink: {
      type: String,
    },

    isValidated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("Event", eventSchema);