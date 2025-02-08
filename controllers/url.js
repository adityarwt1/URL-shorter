const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.render("error", { message: "URL is required!" });
    }

    const shortid = nanoid(8);

    await URL.create({
        shortid,
        redirectURL: url,
        visitHistory: []
    });

    res.redirect("/");
}

module.exports = { handleGenerateNewShortURL };
