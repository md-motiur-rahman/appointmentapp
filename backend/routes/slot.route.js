import express from "express";
import { addDateSlot, addTimeSlot } from "../controllers/slot.controller.js";
import protectedRoute from "../middleware/protectedRoute.js";

const slotRouter = express.Router();

slotRouter.post("/adddateslot", protectedRoute, addDateSlot);
slotRouter.post("/addtimeslot/:id", protectedRoute, addTimeSlot)

export default slotRouter;
