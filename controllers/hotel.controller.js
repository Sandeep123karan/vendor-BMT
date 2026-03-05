// const Hotel = require("../models/Hotel.model");
// const cloudinary = require("../config/cloudinary");

// /* ================= ➕ ADD HOTEL ================= */
// exports.addHotel = async (req, res) => {
//   try {
//     if (!req.files?.image) {
//       return res.status(400).json({ message: "Hotel main image required" });
//     }

//     // Upload main image
//     const mainImage = await cloudinary.uploader.upload(
//       req.files.image[0].path,
//       { folder: "hotels/main" }
//     );

//     // Upload hotel gallery images
//     let gallery = [];
//     if (req.files.gallery) {
//       if (req.files.gallery.length > 10) {
//         return res
//           .status(400)
//           .json({ message: "Maximum 10 gallery images allowed" });
//       }

//       for (let file of req.files.gallery) {
//         const uploaded = await cloudinary.uploader.upload(file.path, {
//           folder: "hotels/gallery",
//         });

//         gallery.push({
//           public_id: uploaded.public_id,
//           url: uploaded.secure_url,
//         });
//       }
//     }

//     const amenities = req.body.amenities
//       ? JSON.parse(req.body.amenities)
//       : [];

//     const hotel = await Hotel.create({
//       vendor: req.vendor._id,
//       name: req.body.name,
//       location: req.body.location,
//       description: req.body.description,
//       category: req.body.category,
//       rating: req.body.rating,
//       amenities,
//       image: {
//         public_id: mainImage.public_id,
//         url: mainImage.secure_url,
//       },
//       gallery,
//       rooms: [], // Initially empty, will be added separately
//     });

//     res.json({ success: true, hotel });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ================= ➕ ADD ROOM TO HOTEL ================= */
// exports.addRoom = async (req, res) => {
//   try {
//     const { hotelId } = req.params;

//     // Upload room gallery images
//     let roomGallery = [];
//     if (req.files?.roomGallery) {
//       if (req.files.roomGallery.length > 5) {
//         return res
//           .status(400)
//           .json({ message: "Maximum 5 images per room allowed" });
//       }

//       for (let file of req.files.roomGallery) {
//         const uploaded = await cloudinary.uploader.upload(file.path, {
//           folder: "hotels/rooms",
//         });

//         roomGallery.push({
//           public_id: uploaded.public_id,
//           url: uploaded.secure_url,
//         });
//       }
//     }

//     const specialFeatures = req.body.specialFeatures
//       ? JSON.parse(req.body.specialFeatures)
//       : [];

//     const roomData = {
//       roomNumber: req.body.roomNumber,
//       roomType: req.body.roomType,
//       bedSize: req.body.bedSize,
//       pricePerNight: req.body.pricePerNight,
//       maxOccupancy: req.body.maxOccupancy,
//       availability: req.body.availability === "true",
//       hasWiFi: req.body.hasWiFi === "true",
//       hasAC: req.body.hasAC === "true",
//       hasTV: req.body.hasTV === "true",
//       hasMiniBar: req.body.hasMiniBar === "true",
//       hasBalcony: req.body.hasBalcony === "true",
//       foodIncluded: req.body.foodIncluded,
//       description: req.body.description,
//       specialFeatures,
//       gallery: roomGallery,
//     };

//     const hotel = await Hotel.findOneAndUpdate(
//       { _id: hotelId, vendor: req.vendor._id },
//       { $push: { rooms: roomData } },
//       { new: true }
//     );

//     if (!hotel) {
//       return res.status(404).json({ message: "Hotel not found" });
//     }

//     res.json({ success: true, hotel });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ================= ✏️ UPDATE ROOM ================= */
// exports.updateRoom = async (req, res) => {
//   try {
//     const { hotelId, roomId } = req.params;

//     const hotel = await Hotel.findOne({
//       _id: hotelId,
//       vendor: req.vendor._id,
//     });

//     if (!hotel) {
//       return res.status(404).json({ message: "Hotel not found" });
//     }

//     const room = hotel.rooms.id(roomId);
//     if (!room) {
//       return res.status(404).json({ message: "Room not found" });
//     }

//     // Upload new room gallery images if provided
//     if (req.files?.roomGallery) {
//       const roomGallery = [];
//       for (let file of req.files.roomGallery) {
//         const uploaded = await cloudinary.uploader.upload(file.path, {
//           folder: "hotels/rooms",
//         });

//         roomGallery.push({
//           public_id: uploaded.public_id,
//           url: uploaded.secure_url,
//         });
//       }
//       room.gallery.push(...roomGallery);
//     }

//     // Update room fields
//     if (req.body.roomNumber) room.roomNumber = req.body.roomNumber;
//     if (req.body.roomType) room.roomType = req.body.roomType;
//     if (req.body.bedSize) room.bedSize = req.body.bedSize;
//     if (req.body.pricePerNight) room.pricePerNight = req.body.pricePerNight;
//     if (req.body.maxOccupancy) room.maxOccupancy = req.body.maxOccupancy;
//     if (req.body.availability !== undefined)
//       room.availability = req.body.availability === "true";
//     if (req.body.hasWiFi !== undefined) room.hasWiFi = req.body.hasWiFi === "true";
//     if (req.body.hasAC !== undefined) room.hasAC = req.body.hasAC === "true";
//     if (req.body.hasTV !== undefined) room.hasTV = req.body.hasTV === "true";
//     if (req.body.hasMiniBar !== undefined)
//       room.hasMiniBar = req.body.hasMiniBar === "true";
//     if (req.body.hasBalcony !== undefined)
//       room.hasBalcony = req.body.hasBalcony === "true";
//     if (req.body.foodIncluded) room.foodIncluded = req.body.foodIncluded;
//     if (req.body.description) room.description = req.body.description;
//     if (req.body.specialFeatures)
//       room.specialFeatures = JSON.parse(req.body.specialFeatures);

//     await hotel.save();

//     res.json({ success: true, hotel });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ================= ❌ DELETE ROOM ================= */
// exports.deleteRoom = async (req, res) => {
//   try {
//     const { hotelId, roomId } = req.params;

//     const hotel = await Hotel.findOneAndUpdate(
//       { _id: hotelId, vendor: req.vendor._id },
//       { $pull: { rooms: { _id: roomId } } },
//       { new: true }
//     );

//     if (!hotel) {
//       return res.status(404).json({ message: "Hotel not found" });
//     }

//     res.json({ success: true, hotel });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ================= 📥 GET HOTELS ================= */
// exports.getHotels = async (req, res) => {
//   try {
//     const hotels = await Hotel.find({ vendor: req.vendor._id });
//     res.json(hotels);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ================= ✏️ UPDATE HOTEL ================= */
// exports.updateHotel = async (req, res) => {
//   try {
//     let updateData = { ...req.body };

//     if (req.body.amenities) {
//       updateData.amenities = JSON.parse(req.body.amenities);
//     }

//     // Update main image
//     if (req.files?.image) {
//       const mainImage = await cloudinary.uploader.upload(
//         req.files.image[0].path,
//         { folder: "hotels/main" }
//       );

//       updateData.image = {
//         public_id: mainImage.public_id,
//         url: mainImage.secure_url,
//       };
//     }

//     // Add new gallery images
//     if (req.files?.gallery) {
//       const galleryUploads = [];
//       for (let file of req.files.gallery) {
//         const uploaded = await cloudinary.uploader.upload(file.path, {
//           folder: "hotels/gallery",
//         });

//         galleryUploads.push({
//           public_id: uploaded.public_id,
//           url: uploaded.secure_url,
//         });
//       }

//       updateData.$push = {
//         gallery: { $each: galleryUploads },
//       };
//     }

//     const hotel = await Hotel.findOneAndUpdate(
//       { _id: req.params.id, vendor: req.vendor._id },
//       updateData,
//       { new: true }
//     );

//     res.json({ success: true, hotel });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /* ================= ❌ DELETE HOTEL ================= */
// exports.deleteHotel = async (req, res) => {
//   try {
//     await Hotel.findOneAndDelete({
//       _id: req.params.id,
//       vendor: req.vendor._id,
//     });
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Hotel = require("../models/Hotel.model");
const cloudinary = require("../config/cloudinary");

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const parseArr = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val.split(",").map((s) => s.trim()); }
};

const toBool = (val) => val === "true" || val === true;

const uploadMany = async (files, folder) => {
  const urls = [];
  for (const file of files) {
    const res = await cloudinary.uploader.upload(file.path, { folder });
    urls.push(res.secure_url);
  }
  return urls;
};

/* ═══════════════════════════════════════════
   ADD HOTEL
═══════════════════════════════════════════ */
exports.addHotel = async (req, res) => {
  try {
    const d = req.body;

    if (!req.files?.hotelImages?.length) {
      return res.status(400).json({ message: "At least one hotel image is required" });
    }

    // Upload images
    const hotelImages = await uploadMany(req.files.hotelImages, "hotels/main");
    const roomImages  = req.files?.roomImages ? await uploadMany(req.files.roomImages, "hotels/rooms")   : [];
    const videos      = req.files?.videos     ? await uploadMany(req.files.videos,     "hotels/videos")  : [];

    // Location
    const location = {
      type: "Point",
      coordinates:
        d.latitude && d.longitude
          ? [parseFloat(d.longitude), parseFloat(d.latitude)]
          : [0, 0],
    };

    const hotel = await Hotel.create({
      vendor: req.vendor._id,

      // Basic
      hotelName:   d.hotelName,
      hotelType:   d.hotelType,
      description: d.description,
      starRating:  d.starRating  ? Number(d.starRating)  : undefined,
      yearBuilt:   d.yearBuilt   ? Number(d.yearBuilt)   : undefined,

      // Contact
      phone:          d.phone,
      alternatePhone: d.alternatePhone,
      email:          d.email,
      website:        d.website,

      // Address
      country:  d.country || "India",
      state:    d.state,
      city:     d.city,
      area:     d.area,
      address:  d.address,
      pincode:  d.pincode,
      landmark: d.landmark,
      location,

      // Facilities
      amenities:          parseArr(d.amenities),
      propertyHighlights: parseArr(d.propertyHighlights),
      foodAndDining:      parseArr(d.foodAndDining),
      safetyAndSecurity:  parseArr(d.safetyAndSecurity),
      wellnessAndSpa:     parseArr(d.wellnessAndSpa),
      businessFacilities: parseArr(d.businessFacilities),
      mediaAndTechnology: parseArr(d.mediaAndTechnology),
      transportServices:  parseArr(d.transportServices),
      paymentMethods:     parseArr(d.paymentMethods),

      // Media
      hotelImages,
      roomImages,
      videos,
      virtualTourLink: d.virtualTourLink,

      // Policies
      checkInTime:          d.checkInTime,
      checkOutTime:         d.checkOutTime,
      earlyCheckInAllowed:  d.earlyCheckInAllowed !== undefined ? toBool(d.earlyCheckInAllowed) : undefined,
      lateCheckOutAllowed:  d.lateCheckOutAllowed !== undefined ? toBool(d.lateCheckOutAllowed) : undefined,
      cancellationPolicy:   d.cancellationPolicy,
      childPolicy:          d.childPolicy,
      petPolicy:            d.petPolicy,
      coupleFriendly:       d.coupleFriendly  !== undefined ? toBool(d.coupleFriendly)  : true,
      localIdAllowed:       d.localIdAllowed  !== undefined ? toBool(d.localIdAllowed)  : true,

      // Pricing
      pricePerNight:  d.pricePerNight  ? Number(d.pricePerNight)  : undefined,
      taxPercentage:  d.taxPercentage  ? Number(d.taxPercentage)  : undefined,
      serviceCharge:  d.serviceCharge  ? Number(d.serviceCharge)  : undefined,
      extraBedCharge: d.extraBedCharge ? Number(d.extraBedCharge) : undefined,
      refundPolicy:   d.refundPolicy,
      gstNumber:      d.gstNumber,

      rooms: [],
    });

    res.status(201).json({ success: true, message: "Hotel added successfully", hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════
   GET VENDOR HOTELS
═══════════════════════════════════════════ */
exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ vendor: req.vendor._id }).sort({ createdAt: -1 });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════
   GET SINGLE HOTEL
═══════════════════════════════════════════ */
exports.getSingleHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id, vendor: req.vendor._id });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════
   UPDATE HOTEL
═══════════════════════════════════════════ */
exports.updateHotel = async (req, res) => {
  try {
    const d = req.body;

    const updateData = {
      // Basic
      hotelName:   d.hotelName,
      hotelType:   d.hotelType,
      description: d.description,
      starRating:  d.starRating  ? Number(d.starRating)  : undefined,
      yearBuilt:   d.yearBuilt   ? Number(d.yearBuilt)   : undefined,

      // Contact
      phone:          d.phone,
      alternatePhone: d.alternatePhone,
      email:          d.email,
      website:        d.website,

      // Address
      country:  d.country,
      state:    d.state,
      city:     d.city,
      area:     d.area,
      address:  d.address,
      pincode:  d.pincode,
      landmark: d.landmark,

      // Facilities
      amenities:          parseArr(d.amenities),
      propertyHighlights: parseArr(d.propertyHighlights),
      foodAndDining:      parseArr(d.foodAndDining),
      safetyAndSecurity:  parseArr(d.safetyAndSecurity),
      wellnessAndSpa:     parseArr(d.wellnessAndSpa),
      businessFacilities: parseArr(d.businessFacilities),
      mediaAndTechnology: parseArr(d.mediaAndTechnology),
      transportServices:  parseArr(d.transportServices),
      paymentMethods:     parseArr(d.paymentMethods),

      // Media
      virtualTourLink: d.virtualTourLink,

      // Policies
      checkInTime:         d.checkInTime,
      checkOutTime:        d.checkOutTime,
      earlyCheckInAllowed: d.earlyCheckInAllowed !== undefined ? toBool(d.earlyCheckInAllowed) : undefined,
      lateCheckOutAllowed: d.lateCheckOutAllowed !== undefined ? toBool(d.lateCheckOutAllowed) : undefined,
      cancellationPolicy:  d.cancellationPolicy,
      childPolicy:         d.childPolicy,
      petPolicy:           d.petPolicy,
      coupleFriendly:      d.coupleFriendly  !== undefined ? toBool(d.coupleFriendly)  : undefined,
      localIdAllowed:      d.localIdAllowed  !== undefined ? toBool(d.localIdAllowed)  : undefined,

      // Pricing
      pricePerNight:  d.pricePerNight  ? Number(d.pricePerNight)  : undefined,
      taxPercentage:  d.taxPercentage  ? Number(d.taxPercentage)  : undefined,
      serviceCharge:  d.serviceCharge  ? Number(d.serviceCharge)  : undefined,
      extraBedCharge: d.extraBedCharge ? Number(d.extraBedCharge) : undefined,
      refundPolicy:   d.refundPolicy,
      gstNumber:      d.gstNumber,
    };

    // Location
    if (d.latitude && d.longitude) {
      updateData.location = {
        type: "Point",
        coordinates: [parseFloat(d.longitude), parseFloat(d.latitude)],
      };
    }

    // Append new images
    if (req.files?.hotelImages?.length) {
      const urls = await uploadMany(req.files.hotelImages, "hotels/main");
      updateData.$push = { ...(updateData.$push || {}), hotelImages: { $each: urls } };
    }
    if (req.files?.roomImages?.length) {
      const urls = await uploadMany(req.files.roomImages, "hotels/rooms");
      updateData.$push = { ...(updateData.$push || {}), roomImages: { $each: urls } };
    }
    if (req.files?.videos?.length) {
      const urls = await uploadMany(req.files.videos, "hotels/videos");
      updateData.$push = { ...(updateData.$push || {}), videos: { $each: urls } };
    }

    // Remove undefined keys (don't overwrite existing data with undefined)
    Object.keys(updateData).forEach(
      (k) => updateData[k] === undefined && delete updateData[k]
    );

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.id, vendor: req.vendor._id },
      updateData,
      { new: true }
    );

    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════
   DELETE HOTEL
═══════════════════════════════════════════ */
exports.deleteHotel = async (req, res) => {
  try {
    await Hotel.findOneAndDelete({ _id: req.params.id, vendor: req.vendor._id });
    res.json({ success: true, message: "Hotel deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════
   ADD ROOM
═══════════════════════════════════════════ */
exports.addRoom = async (req, res) => {
  try {
    const d = req.body;

    // Upload room images
    let images = [];
    if (req.files?.roomGallery?.length) {
      if (req.files.roomGallery.length > 10) {
        return res.status(400).json({ message: "Maximum 10 images per room" });
      }
      images = await uploadMany(req.files.roomGallery, "hotels/room-gallery");
    }

    const roomData = {
      // Basic
      roomType:    d.roomType,
      roomName:    d.roomName,
      description: d.description,
      floorNumber: d.floorNumber,
      roomSize:    d.roomSize,
      viewType:    d.viewType,
      status:      d.status || "available",

      // Pricing
      basePrice:     Number(d.basePrice),
      offerPrice:    d.offerPrice    ? Number(d.offerPrice)    : undefined,
      tax:           d.tax           ? Number(d.tax)           : undefined,
      serviceCharge: d.serviceCharge ? Number(d.serviceCharge) : undefined,

      // Capacity
      totalRooms:     Number(d.totalRooms),
      availableRooms: Number(d.availableRooms),
      maxGuests:      d.maxGuests  ? Number(d.maxGuests)  : undefined,
      adults:         d.adults     ? Number(d.adults)     : undefined,
      children:       d.children   ? Number(d.children)   : undefined,

      // Bed
      bedType:           d.bedType,
      bedCount:          d.bedCount ? Number(d.bedCount) : undefined,
      extraBedAvailable: toBool(d.extraBedAvailable),
      extraBedCharge:    d.extraBedCharge ? Number(d.extraBedCharge) : undefined,

      // Room Features
      balcony:      toBool(d.balcony),
      airCondition: toBool(d.airCondition),
      heater:       toBool(d.heater),
      wifi:         toBool(d.wifi),
      tv:           toBool(d.tv),
      minibar:      toBool(d.minibar),
      wardrobe:     toBool(d.wardrobe),
      workDesk:     toBool(d.workDesk),
      iron:         toBool(d.iron),
      kitchen:      toBool(d.kitchen),

      // Bathroom
      bathroomType: d.bathroomType,
      bathtub:      toBool(d.bathtub),
      shower:       toBool(d.shower),
      toiletries:   toBool(d.toiletries),
      hairDryer:    toBool(d.hairDryer),

      // Meals
      breakfastIncluded: toBool(d.breakfastIncluded),
      lunchIncluded:     toBool(d.lunchIncluded),
      dinnerIncluded:    toBool(d.dinnerIncluded),

      // Policies
      smokingAllowed:     toBool(d.smokingAllowed),
      refundable:         toBool(d.refundable),
      cancellationPolicy: d.cancellationPolicy,

      images,
    };

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId, vendor: req.vendor._id },
      { $push: { rooms: roomData } },
      { new: true }
    );

    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════
   UPDATE ROOM
═══════════════════════════════════════════ */
exports.updateRoom = async (req, res) => {
  try {
    const d = req.body;

    const hotel = await Hotel.findOne({ _id: req.params.hotelId, vendor: req.vendor._id });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const room = hotel.rooms.id(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Append new images
    if (req.files?.roomGallery?.length) {
      const newImgs = await uploadMany(req.files.roomGallery, "hotels/room-gallery");
      room.images.push(...newImgs);
    }

    // String fields
    ["roomType","roomName","description","floorNumber","roomSize","viewType",
     "bedType","bathroomType","cancellationPolicy","status"].forEach((f) => {
      if (d[f] !== undefined) room[f] = d[f];
    });

    // Number fields
    ["basePrice","offerPrice","tax","serviceCharge","totalRooms","availableRooms",
     "maxGuests","adults","children","bedCount","extraBedCharge"].forEach((f) => {
      if (d[f] !== undefined && d[f] !== "") room[f] = Number(d[f]);
    });

    // Boolean fields
    ["extraBedAvailable","balcony","airCondition","heater","wifi","tv","minibar",
     "wardrobe","workDesk","iron","kitchen","bathtub","shower","toiletries",
     "hairDryer","breakfastIncluded","lunchIncluded","dinnerIncluded",
     "smokingAllowed","refundable"].forEach((f) => {
      if (d[f] !== undefined) room[f] = toBool(d[f]);
    });

    await hotel.save();
    res.json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════
   DELETE ROOM
═══════════════════════════════════════════ */
exports.deleteRoom = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId, vendor: req.vendor._id },
      { $pull: { rooms: { _id: req.params.roomId } } },
      { new: true }
    );
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════
   DELETE ROOM IMAGE
═══════════════════════════════════════════ */
exports.deleteRoomImage = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    const { imageUrl } = req.body;

    const hotel = await Hotel.findOne({ _id: hotelId, vendor: req.vendor._id });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const room = hotel.rooms.id(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    room.images = room.images.filter((img) => img !== imageUrl);
    await hotel.save();

    res.json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════════
   DELETE HOTEL IMAGE
═══════════════════════════════════════════ */
exports.deleteHotelImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.id, vendor: req.vendor._id },
      { $pull: { hotelImages: imageUrl } },
      { new: true }
    );
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json({ success: true, hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};