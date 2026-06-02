const express = require("express");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

/* MEMORY STORAGE */
let dataStore = [];

/* EMAIL SETUP */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tirumulatirumula201@gmail.com",
        pass: "pnbcqpotvudbeicl"   // your Gmail App Password
    }
});

/* HOME PAGE */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "index.html"));
});

/* GET ALL RESOURCES */
app.get("/resources", (req, res) => {
    res.json(dataStore);
});

/* SAVE RESOURCE + EMAIL ALERT */
app.post("/resources", (req, res) => {

    const cpu = Number(req.body.cpu);
    const ram = Number(req.body.ram);
    const storage = Number(req.body.storage);

    const resource = {
        id: Date.now(),
        cpu,
        ram,
        storage,
        status: (cpu > 90 || ram > 85 || storage > 90) ? "HIGH" : "NORMAL",
        emailStatus: "NOT_SENT"
    };

    dataStore.push(resource);

    console.log("RESOURCE SAVED:", resource);

    /* 🚨 SEND EMAIL IF HIGH */
    if (resource.status === "HIGH") {

        const mailOptions = {
            from: "tirumulatirumula201@gmail.com",
            to: "tirumulatirumula201@gmail.com",
            subject: "🚨 AI Cloud Resource Alert",
            text: `HIGH USAGE DETECTED:
CPU: ${cpu}%
RAM: ${ram}%
Storage: ${storage}%`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log("❌ EMAIL ERROR:", err);
                resource.emailStatus = "FAILED";
            } else {
                console.log("✅ EMAIL SENT:", info.response);
                resource.emailStatus = "SENT";
            }
        });
    }

    res.json(resource);
});

/* DELETE RESOURCE */
app.delete("/resources/:id", (req, res) => {
    const id = Number(req.params.id);
    dataStore = dataStore.filter(item => item.id !== id);

    res.json({ message: "Deleted successfully" });
});

/* START SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});