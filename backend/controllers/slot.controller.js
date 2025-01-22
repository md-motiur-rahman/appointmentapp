import User from "../models/auth.model.js";
import Slot from "../models/slot.model.js";

export const addDateSlot = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { dateslot } = req.body;

    if (dateslot.trim().length === 0) {
      return res.status(400).json({ error: "Date is required" });
    }

    const newSlot = new Slot({
      provider: user._id,
      dateslot,
    });

    await newSlot.save();

    return res.status(201).json(newSlot);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

export const addTimeSlot = async (req, res) => {
  try {
    const dateId = req.params.id;
    const userId = req.user._id;
    const { time } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }
    const date = await Slot.findById(dateId);
    if (!date) {
      return res.status(404).json({ error: "No date" });
    }

    const existeTime = date.timeslot.some((slot) => slot.time === time);
    if (existeTime) {
      return res.status(409).json({ error: "Already added" });
    }

    date.timeslot.push({ time });
    
    if (!date.dateavailability) {
      date.dateavailability = true;
      await date.save();
    }
    await date.save();

    return res.status(200).json(date);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};
