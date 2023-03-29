var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");

var app = express();

app.use(bodyParser());
app.use(cors());

app.post("/test", (req, res) => console.log(req.body));
app.get("/testies", (req, res) => console.log(req.body));

// mongoose
// 	.connect(
// 		"mongodb+srv://slimanirayene:0000@pitchecluster.qost1.mongodb.net/Ouedkniss?retryWrites=true&w=majority"
// 	)
// 	.then((db) => {
// 		console.log("Database connected");
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

app.listen(2000);
