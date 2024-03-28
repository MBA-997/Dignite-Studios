const express = require("express");
const cors = require("cors");
const ContactRoutes = require("./routes/ContactRoutes");

const app = express();
const PORT = 5000;

app.use(express.static("assets"));
app.use(cors());
app.use(express.json());
app.use("/api/contact", ContactRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.all("*", (req, res, next) => {
  console.log("No such route found");
  next();
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
