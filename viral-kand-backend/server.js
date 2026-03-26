const express = require('express');
const cors = require('cors');
const { Readable } = require("stream");

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
  try {
    const videoUrl = req.query.url;  // <<==== FRONTEND SE AAYEGA

    if (!videoUrl) {
      return res.status(400).send("URL missing");
    }

    const response = await fetch(videoUrl, {
      headers: {
        "Referer": "https://viralkand.com/",
        "Origin": "https://viralkand.com/"
      }
    });

    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch video");
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Accept-Ranges", "bytes");

    const stream = Readable.fromWeb(response.body);
    stream.pipe(res);

  } catch (err) {
    console.error("PROXY ERROR:", err);
    res.status(500).send("Proxy failed");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});