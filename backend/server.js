
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const Contact = require("./models/contact.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api", (req, res) => {
  res.json({ message: "Contact API is running!" });
});

// Receive contact form submissions
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Please complete all fields.",
      });
    }

    // Validate field lengths
    if (
      name.trim().length > 100 ||
      email.trim().length > 254 ||
      subject.trim().length > 200 ||
      message.trim().length > 5000
    ) {
      return res.status(400).json({
        message: "One or more fields are too long.",
      });
    }

    // Validate email format
    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!validEmail) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    // Save the contact message to MongoDB
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      message: "Your message was sent successfully!",
      id: contact._id,
    });
  } catch (error) {
    console.error("Contact submission error:", error);

    return res.status(500).json({
      message: "Unable to send your message. Please try again.",
    });
  }
});

// Start server after the database connects
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Backend running at http://localhost:${process.env.PORT || 5000}`
      );
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
