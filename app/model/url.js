"use-strict";

const mongoose = require("mongoose");

// Create a schema for URLs
const urlSchema = new mongoose.Schema({
    _id: { type: String },
    accessKey: { type: String },
    originalUrl: { type: String },
    createdAt: { type: String },
    ip: { type: String },
    api: { type: Boolean, enum: [true, false], default: false },
});

// Create a model for URLs using the schema
module.exports = mongoose.model("Url", urlSchema);
