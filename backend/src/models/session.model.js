// src/models/session.model.js

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  loginTimestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Session = mongoose.model("Session", sessionSchema);

export { Session };
