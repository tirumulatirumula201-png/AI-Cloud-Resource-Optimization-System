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
        pass: "huib ngek vbhc vmwm"
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

/* SAVE RESOURCE */
app.post("/resources", (req, res) => {
    const resource = {
        id: Date.now(),
        cpu: Number(req.body.cpu),
        ram: Number(req.body.ram),
        storage: Number(req.body.storage),
        status:
            req.body.cpu > 90 ||
            req.body.ram > 85 ||
            req.body.storage > 90
                ? "HIGH"
                : "NORMAL"
    };

    dataStore.push(resource);
    res.json(resource);
});

/* DELETE RESOURCE */
app.delete("/resources/:id", (req, res) => {
    const id = Number(req.params.id);
    dataStore = dataStore.filter(item => item.id !== id);

    res.json({ message: "Deleted successfully" });
});

/* ALERT + EMAIL */
app.post("/alert", (req, res) => {
    const cpu = Number(req.body.cpu);
    const ram = Number(req.body.ram);
    const storage = Number(req.body.storage);

    let status = "NORMAL";

    if (cpu > 90 || ram > 85 || storage > 90) {
        status = "CRITICAL";

        const mailOptions = {
            from: "tirumulatirumula201@gmail.com",
            to: "tirumulatirumula201@gmail.com",
            subject: "🚨 AI Cloud Alert",
            text: `CPU: ${cpu}% RAM: ${ram}% Storage: ${storage}%`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log("EMAIL ERROR:", err);
                return res.json({ status, emailStatus: "FAILED" });
            }

            console.log("EMAIL SENT:", info.response);
            return res.json({ status, emailStatus: "SENT" });
        });

        return;
    }

    if (cpu > 70 || ram > 70) {
        status = "WARNING";
    }

    res.json({ status, emailStatus: "NOT_SENT" });
});

/* START SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});