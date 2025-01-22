import express from "express"
import { bookAppointment, getBooking, getBookings, searchBooking, updateBooking } from "../controllers/booking.controller.js"
import protectedRoute from "../middleware/protectedRoute.js"

const bookingRouter = express.Router()

bookingRouter.post("/bookappointment/:id", bookAppointment)
bookingRouter.get("/appointment/:id", getBooking)
bookingRouter.get("/bookings", protectedRoute, getBookings)
bookingRouter.post("/updatebooking/:id", protectedRoute, updateBooking)
bookingRouter.get("/search", protectedRoute, searchBooking)

export default bookingRouter