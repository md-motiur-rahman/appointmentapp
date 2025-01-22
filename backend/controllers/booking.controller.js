import User from "../models/auth.model.js";
import Booking from "../models/booking.model.js";
import Slot from "../models/slot.model.js";

export const bookAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, dob, phone, bookingdate, bookingtime } = req.body;

    // Helper to validate input fields
    const isEmpty = (...fields) => fields.some(field => !field?.trim());
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation
    if (isEmpty(name, email, dob, phone, bookingdate, bookingtime)) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (email && !emailRegEx.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (phone && !/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }
    if (dob && !/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      return res.status(400).json({ error: "Invalid date of birth format (DD/MM/YYYY)" });
    }
    if (bookingdate && !/^\d{2}\/\d{2}\/\d{4}$/.test(bookingdate)) {
      return res.status(400).json({ error: "Invalid booking date format (DD/MM/YYYY)" });
    }
    if (bookingtime && !/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(bookingtime)) {
      return res.status(400).json({ error: "Invalid booking time format (e.g., 09:30 AM)" });
    }

    // Check provider existence
    const provider = await User.findById(id);
    if (!provider) {
      return res.status(404).json({
        error: "Invalid invitation. Please contact us via phone.",
      });
    }

    // Check for existing booking by email
    if (await Booking.findOne({ email })) {
      return res.status(400).json({ error: "You already have a booking." });
    }

    // Validate date and time slot
    const slot = await Slot.findOne({ dateslot: bookingdate });
    if (!slot?.dateavailability) {
      return res.status(404).json({ error: "Please choose a different date." });
    }
    const timeSlot = slot.timeslot.find(t => t.time === bookingtime);
    if (!timeSlot?.availibility) {
      return res.status(404).json({ error: "Please choose a different time." });
    }

    // Create new booking
    const newBooking = await Booking.create({
      provider: provider._id.toString(),
      name,
      email,
      phone,
      dob,
      bookingdate,
      bookingtime,
    });
    if(!newBooking){
      return res.status(400).json({error: "error while booking"})
    }
    // Update slot availability
    timeSlot.availibility = false;
    await slot.save();

    // Update date availability if all slots are booked
    if (slot.timeslot.every(t => !t.availibility)) {
      slot.dateavailability = false;
      await slot.save();
    }

    return res.status(201).json(newBooking);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


export const getBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id).populate({
      path: "provider",
      select: "-password",
    });

    if (!booking) {
      return res.status(404).json({ error: "No booking is found" });
    }
    if (!booking.active) {
      return res.status(400).json({ error: "Invalid search" });
    }
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }

    const bookings = await Booking.find({ provider: user._id });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookingId = req.params.id;
    const {
      name,
      email,
      dob,
      phone,
      bookingdate,
      bookingtime,
      status,
      active,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "No booking found" });
    }
    const isEmpty = (...fields) => fields.some(field => !field?.trim());
    if (isEmpty(name, email, dob, phone, bookingdate, bookingtime)) {
      return res.status(400).json({ error: "All fields are required" });
    }
    booking.name = name || booking.name;
    booking.email = email || booking.email;
    booking.dob = dob || booking.dob;
    booking.phone = phone || booking.phone;
    booking.bookingdate = bookingdate || booking.bookingdate;
    booking.bookingtime = bookingtime || booking.bookingtime;
    booking.status = status || booking.status;
    booking.active = active || booking.active;

    booking = await booking.save();

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const searchBooking = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({error: "User not found"})
    }
    const {name, email, dob, bookingdate} = req.body

    const query = {}
    if(email) query.email = email
    if(dob) query.dob = dob
    if(name) query.name = name
    if(bookingdate)  query.bookingdate = bookingdate

    const results = await Booking.find(query)

    if(results.length === 0){
      return res.status(404).json({error: "No Booking found"})
    }

    return res.status(200).json(results)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching for bookings.' });
  }
}
