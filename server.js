const express = require("express");
const connectDB = require("./config/db_config.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const magicMoverRoutes = require("./routes/magicMover.js");
const magicItemRoutes = require("./routes/magicItem.js");

require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
connectDB();

//Routes
app.use("/api/magicMover", magicMoverRoutes);
app.use("/api/magicItem", magicItemRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
