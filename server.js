const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
            continue;
        }

        const [key, ...valueParts] = trimmed.split("=");
        process.env[key.trim()] ??= valueParts.join("=").trim();
    }
}

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/neet-result-portal";

async function connectDatabase() {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Connected to MongoDB at ${mongoUri}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "neetsecret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use((req, res, next) => {
    if (req.path.length > 1 && req.path.endsWith("/")) {
        const query = req.url.slice(req.path.length);
        const normalizedPath = req.path.replace(/\/+$/, "");
        return res.redirect(308, normalizedPath + query);
    }

    next();
});

app.use((req, res, next) => {
    res.locals.currentStudent = req.session.student || null;
    res.locals.isAdmin = Boolean(req.session.isAdmin);
    next();
});

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send(error.message || "Something went wrong.");
});

const port = Number(process.env.PORT) || 3000;

function startServer(targetPort) {
    const server = app.listen(targetPort, () => {
        console.log(`Server running on http://localhost:${targetPort}`);
    });

    server.on("error", (error) => {
        if (error.code === "EADDRINUSE" && !process.env.PORT && targetPort === 3000) {
            console.warn("Port 3000 is already in use. Trying http://localhost:3001 instead.");
            startServer(3001);
            return;
        }

        throw error;
    });
}

connectDatabase().then(() => startServer(port));

