var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");
const fs = require("fs");

var app = express();

app.use(bodyParser());
app.use(cors());

const IoTData = mongoose.model("data", {
	time: String,
	temperature: String,
	turbidity: String,
	salinity: String,
	ph: String,
	image: Array,
});

app.post("/log", async (req, resp) => {
	console.log("uploading .......");

	const base64Data = req.body.image;
	const imageName = "uploads/converted_image1.jpg";

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
			let time = req.body.time;
			let temperature = req.body.temp;
			let turbidity = req.body.turb;
			let salinity = req.body.sal;
			let pH = req.body.ph;

			const doc = new IoTData({
				time: time,
				temperature: temperature,
				turbidity: turbidity,
				salinity: salinity,
				ph: pH,
				image: imageName,
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
