// const mongoose = require("mongoose");

// const vendorSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true
//     },

//     password: {
//       type: String,
//       required: true
//     },

//     service: {
//       type: String,
//       enum: ["Cabs", "Buses", "train", "homestay", "hotel","Stay","Holiday Packages","Entertainment","Cruise","Buses","Cabs","Tour & Activities","BMT Darshan"],
//       required: true
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Vendor", vendorSchema);
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    service: {
      type: String,
      enum: ["cabs", "buses", "train", "homestay", "hotel", "bmt darshan"],
      required: true,
      lowercase: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
