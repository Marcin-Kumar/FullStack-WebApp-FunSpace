const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/fun-space", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
	console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/locations", async (req, res) => {
	const locations = await Campground.find({});
	res.render("locations/index", { locations });
});

app.get("/locations/:id", async (req, res) => {
	const { id } = req.params;
	const location = await Campground.findById(id);
	res.render("locations/show", { location });
});

app.listen(3000, () => {
	console.log("Server on port 3000");
});
