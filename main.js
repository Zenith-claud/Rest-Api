const express = require('express'),
const cors = require('cors'),
const secure = require('ssl-express-www');
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;

const main = require("./api/maain.js"),
	index = require("./api/index.js");

app.use(cors());
app.enable('trust proxy');
app.set("json spaces", 2);
app.use(secure);app.use(express.static("public"));
app.set("views", __dirname + "/public");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: true }));
app.use('/', main);
app.use('/api', index);

app.listen(PORT, (error) => {
	if (!error)
		console.log("APP LISTEN TO PORT " + PORT)
	else
		console.log("ERROR OCCUIRED")
});

module.exports = app
