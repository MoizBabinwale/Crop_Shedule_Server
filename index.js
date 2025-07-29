const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/config");

const app = express();

app.use(cors());
app.use(express.json());

const scheduleRoutes = require("./routes/ScheduleRoutes.js");
app.use("/api/schedule", scheduleRoutes);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
