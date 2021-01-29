const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");

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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/locations", async (req, res) => {
	const locations = await Campground.find({});
	res.render("locations/index", { locations });
});

app.get("/locations/new", async (req, res) => {
	res.render("locations/new");
});

app.get("/locations/:id", async (req, res) => {
	const { id } = req.params;
	const location = await Campground.findById(id);
	res.render("locations/show", { location });
});

app.get("/locations/:id/edit", async (req, res) => {
	const { id } = req.params;
	const location = await Campground.findById(id);
	res.render("locations/edit", { location });
});

app.post("/locations", async (req, res) => {
	const details = req.body.campground;
	const location = new Campground(details);
	await location.save();
	const locations = await Campground.find({});
	res.redirect(`/locations/${location._id}`);
});

app.put("/locations/:id", async (req, res) => {
	const { id } = req.params;
	const location = await Campground.findByIdAndUpdate(
		id,
		{ ...req.body.campground },
		{
			new: true
		}
	);
	res.redirect("locations/show", { location });
});

app.delete("/locations/:id", async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndRemove(id);
	res.redirect("/locations");
});

app.listen(3000, () => {
	console.log("Server on port 3000");
});
