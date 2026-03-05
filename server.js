require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();


app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json());

connectDB();

app.use("/api/vendor/auth", require("./routes/auth.routes"));
app.use("/api/vendor/hotels", require("./routes/hotel.routes"));
app.use("/api/hotel-bookings", require("./routes/hotelBooking.routes"));
app.use("/api/vendor/cabs", require("./routes/cab.routes"));
app.use("/api/cabs", require("./routes/cabBooking.routes"));
app.use("/api/vendor/cabs", require("./routes/vendorCabBooking.routes"));
app.use("/api/buses", require("./routes/bus.routes"));
app.use("/api/bus-bookings", require("./routes/busBooking.routes"));
app.use("/api/flights", require("./routes/flight.routes"));
app.use("/api/flight-bookings", require("./routes/flightBooking.routes"));
app.use("/api/vendor/homestay", require("./routes/homestay.routes"));
app.use("/api/homestay-bookings",require("./routes/homestayBooking.routes"));
app.use("/api/vendor/holidays",require("./routes/holiday.routes"));

app.use("/api/holiday-bookings",require("./routes/holidayBooking.routes"));
app.use("/api/vendor/darshans", require("./routes/vendorDarshanRoutes"));
app.use("/api/vendor/apartment", require("./routes/Apartment.routes"));
app.get("/", (req, res) => {
  res.send("🚀 Vendor Backend Running Successfully");
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
