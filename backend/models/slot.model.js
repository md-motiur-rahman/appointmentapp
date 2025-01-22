import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dateslot: {
      type: String,
      required: true,
      unique: true,
    },
    timeslot: [
      {
        time: {
          type: String,
          required: true,
        },
        availibility: {
          type: Boolean,
          default: true,
          required: true,
        },
      },
    ],
    dateavailability: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Slot = mongoose.model("slot", slotSchema);

export default Slot;
