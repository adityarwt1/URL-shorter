const express = require("express");
const app = express();
const urlRoute = require("./routes/url");
require("dotenv").config();
const { connectToMongoDb } = require("./lib/connect");
const URL = require("./models/url");
const path = require("path");

const PORT = process.env.PORT || 3000;

connectToMongoDb(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/url", urlRoute);

app.get("/", async (req, res) => {
    const urls = await URL.find();
    res.render("index", { urls });
});

app.get("/:shortid", async (req, res) => {
    try {
        const { shortid } = req.params;

        const entry = await URL.findOneAndUpdate(
            { shortid },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }
        );

        if (!entry) {
            return res.render("error", { message: "Short URL not found!" });
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        res.render("error", { message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
