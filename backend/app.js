require("dotenv").config({ path: '.env.local' });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

app.get("/", (req, res) => {
    res.json({ message: "Bienvenue sur notre application de SIGB." });
});

require("./app/routes/book.route")(app);
require("./app/routes/library.route")(app);
require("./app/routes/auth.route")(app);

module.exports = app;