const urlExists = require("url-exists");
const mongoose = require("mongoose");
const Url = mongoose.model("url");

const URL = "https://cedar-basketball.glitch.me/";

module.exports = app => {
  app.get("/new/:url(*)", (req, res) => {
    const { url } = req.params;
    urlExists(url, async (err, exists) => {
      try {
        if (!exists) {
         return res.send({"Error": "Invalid URL" });
        }

        const existing = await Url.findOne({ original_url: url });
        if (existing) {
          return res.send(urlEntryToResponse(existing));
        }
        
        const newUrl = new Url({ original_url: url });
        const result = await newUrl.save();
        res.send(urlEntryToResponse(result));
      
      } catch (error) {
        res.status(500).send("Something went wrong");
      }
    });
  });
  
  app.get("/:urlId", async (req, res) => {
    const { urlId } = req.params;
    try {
      const url = await Url.findOne({ urlId });
      if (url) {
        res.redirect(url.original_url); 
      } else {
        res.send({ error: "This url is not on the database." });
      }
    } catch (err) {
      res.status(500).send("Something went wrong");
    }
  });
};

function urlEntryToResponse(entry) {
  return {
    original_url: entry.original_url,
    short_url: URL + entry.urlId
  }
}