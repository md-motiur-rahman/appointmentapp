import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import authRouter from "./routes/auth.route.js";
import bookingRouter from "./routes/booking.route.js";
import slotRouter from "./routes/slot.route.js";

const app = express();

dotenv.config();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/book", bookingRouter);
app.use("/api/timeslot", slotRouter);

app.listen(port, () => {
  connectDB();
  console.log(`runnig at : http://localhost:${port}`);
});
