require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/ConnectDB");
const app = express();
const authRouter = require("./src/routes/authRouter");
const patientRouter = require("./src/routes/patientRouter");
const medicineRouter = require("./src/routes/medicineRouter");
const medicineInfoRouter = require("./src/routes/medicineInfoAiRouter");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const allowedOrigins = [
  "http://localhost:5173",          // Frontend local development
  "capacitor://localhost",          // Capacitor for mobile
  "http://10.0.2.2:5173",          // Android Emulator
  "https://localhost:5173",         // If your frontend is served over HTTPS
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/patient", patientRouter);
app.use("/medicine", medicineRouter);
app.use("/search", medicineInfoRouter);


connectDB()
  .then(() => {
    app.listen(7000, () => console.log("server running on 7000"));
  })
  .catch((err) => console.error(err));
