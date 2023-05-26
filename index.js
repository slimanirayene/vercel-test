var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");
const fs = require("fs");
// const tf = require("@tensorflow/tfjs-node");

var app = express();

app.use(bodyParser());
app.use(cors());

const IoTData = mongoose.model("data", {
	docId: Number,
	time: String,
	label: String,
	probability: Number,
	temperature: String,
	turbidity: String,
	salinity: String,
	ph: String,
	image: String,
	tds: String,
	conductivity: String,
});

app.post("/log", async (req, resp) => {
	console.log("uploading .......");
	let label = req.body.label;
	let probability = req.body.probability;
	let temperature = req.body.temp;
	let turbidity = req.body.turb;
	let salinity = req.body.sal;
	let pH = req.body.ph;
	let conductivity = req.body.conductivity;
	let tds = req.body.tds;
	let date = new Date();
	let day = String(date.getDate()).padStart(2, "0");
	let month = String(date.getMonth() + 1).padStart(2, "0");
	let year = String(date.getFullYear());
	let hours = String(date.getHours()).padStart(2, "0");
	let minutes = String(date.getMinutes()).padStart(2, "0");
	let seconds = String(date.getSeconds()).padStart(2, "0");

	let time = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

	const base64Data = req.body.image;

	// Retrieve the current image count from the database
	const docNumber = (await IoTData.countDocuments({})) + 1;

	const imageName = `uploads/${label}${docNumber}.jpg`;

	// Remove the "data:image/jpeg;base64," prefix from the base64 data
	const imageData = base64Data.replace(/^data:image\/jpeg;base64,/, "");

	// Convert the base64 data to a buffer
	const buffer = Buffer.from(imageData, "base64");

	// Save the buffer as a JPG file
	fs.writeFile(imageName, buffer, (err) => {
		if (err) {
			console.error(err);
			resp.status(500).send("Error saving the image.");
		} else {
			const doc = new IoTData({
				docId: docNumber,
				time: time,
				label: label,
				probability: probability,
				temperature: temperature,
				turbidity: turbidity,
				salinity: salinity,
				ph: pH,
				image: imageName,
				conductivity: conductivity,
				tds: tds,
			});

			doc
				.save()
				.then(() => {
					resp.status(200).json({ status: "OK" });
				})
				.catch((err) => {
					resp.status(500).json({ status: "Not OK" });
					console.log(err);
				});
		}
	});
});

//My online testing get Api : https://vercel-test-gules-five.vercel.app/testies

let check = false;

app.get("/testies", (req, res) => {
	if (check) {
		check = false;
		res.status(200);
		res.json([{ piw: "piw" }, { piw: "piw" }]);
	} else {
		check = true;
		res.status(200);
		res.json([{ piw: "diw" }, { piw: "diw" }]);
	}
});

mongoose
	.connect(
		"mongodb+srv://slimanirayene:0000@pitchecluster.qost1.mongodb.net/test?retryWrites=true&w=majority"
	)
	.then((db) => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.log(err);
	});

app.listen(2000);
