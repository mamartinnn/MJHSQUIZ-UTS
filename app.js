const express = require('express'); 
const app = express(); 
const methodOverride = require("method-override");
const indexRouter = require("./routes/index");

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.set("view engine", "ejs");

app.use("/", indexRouter);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
