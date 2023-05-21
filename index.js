var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");

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

let check = false;

app.post("/test", (req, res) => console.log(req.body));
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

app.post("/esp", (req, res) => {
	res.status(200);
	res.send("pitche loves you so much !!");
});

app.post("/log", async (req, resp) => {
	let temperature = req.body.temp;
	let turbidity = req.body.turb;
	let salinity = req.body.sal;
	let pH = req.body.ph;

	try {
		const doc = new IoTData({
			time: time,
			temperature: temperature,
			turbidity: turbidity,
			salinity: salinity,
			ph: pH,
			// image: Array,
		});
		await doc.save();
		resp.status(200).json({ status: "OK" });
	} catch (err) {
		resp.status(300).json({ status: "Not OK" });
		console.log(err);
	}
	count++;
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
