const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/portfolio")
.then(() => {
    console.log("✅ Database Connected");
})
.catch((err) => {
    console.log("❌ Database Error:", err);
});

// Schema
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Model
const Contact = mongoose.model("Contact", ContactSchema);

// Serve Frontend Folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Contact API
app.post("/contact", async (req, res) => {
    try {
        const contact = new Contact({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });

        await contact.save();

        res.status(200).json({
            message: "Message Saved Successfully✅"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error Saving Message"
        });
    }
});

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
    console.log("🚀 Server Started Successfully");
    console.log(`🌐 Open Website: http://localhost:${PORT}`);
});