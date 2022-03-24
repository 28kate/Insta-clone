const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo...");
});

mongoose.connection.on("error", (err) => {
  console.log("err connection", err);
});

mongoose.connect(MONGOURI);

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

app.listen(PORT, () => {
  console.log("Server Running...");
});
