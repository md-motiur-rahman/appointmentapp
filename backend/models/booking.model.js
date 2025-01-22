import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  bookingdate: {
    type: String,
    required: true,
  },
  bookingtime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "confirmed",
    enum: ["confirmed", "cancelled", "pending"],
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  //   autoapproave: {
  //     type: Boolean,
  //     default: true,
  //   },
});

const Booking = mongoose.model("booking", bookingSchema);

export default Booking;
