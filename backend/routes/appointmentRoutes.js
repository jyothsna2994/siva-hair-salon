const express = require("express");
const router = express.Router();

const Appointment = require("../models/Appointment");

// Create a new appointment
router.post("/", async (req, res) => {
    try {
        const { name, phone, service, date, time } = req.body;

        // Check required fields
        if (!name || !phone || !service || !date || !time) {
            return res.status(400).json({
                message: "Please fill all appointment details."
            });
        }

        // Create appointment
        const appointment = new Appointment({
    name,
    phone,
    service,
    date,
    time,
    status: "Pending"
});

        // Save to MongoDB
        await appointment.save();

        res.status(201).json({
            message: "Appointment booked successfully!",
            appointment
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to book appointment."
        });
    }
});
// Get all appointments
router.get("/", async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .sort({ createdAt: -1 });

        res.status(200).json(appointments);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch appointments."
        });
    }
    });
    // Update appointment status
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
            return res.status(400).json({
                message: "Invalid appointment status."
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found."
            });
        }

        res.status(200).json({
            message: `Appointment ${status.toLowerCase()} successfully.`,
            appointment
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update appointment status."
        });
    }
});


module.exports = router;

