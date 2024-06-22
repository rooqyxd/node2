require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const advertisementRoutes = require("./routes/advertisements");

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(morgan("dev"));


app.use("/api/advertisements", advertisementRoutes);

app.get("/heartbeat", (req, res) => {
	res.send(new Date().toISOString());
});


app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.png'));
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
