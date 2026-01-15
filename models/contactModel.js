const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is Required"],
        },
        email: {
            type: String,
            required: [true, "Email is Required"],
        },
        phone: {
            type: String,
            required: [true, "Phone is Required"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("contact", contactSchema);