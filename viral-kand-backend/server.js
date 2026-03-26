const express = require('express');
const cors = require('cors');
const { Readable } = require("stream");
const cheerio = require('cheerio');
const app = express();
app.use(cors());

app.get("/getvideo", async (req, res) => {
  // const pageURL = "https://viralkand.com/manager-ne-staff-wali-ladki-ko-paise-dekar-choda/";
   const pageURL = req.query.url;

  try {
    // STEP 1 → FETCH MAIN PAGE
    const html = await fetch(pageURL, {
      headers: { "User-Agent": "Mozilla/5.0" }
    }).then(r => r.text());

    const $ = cheerio.load(html);

    // STEP 2 → GET iframe URL
    const iframeURL = $("iframe").attr("src");

    if (!iframeURL) {
      return res.status(404).json({ error: "Iframe not found" });
    }

    console.log("IFRAME:", iframeURL);

    // STEP 3 → FETCH IFRAME PAGE
    const iframeHTML = await fetch(iframeURL, {
      headers: { "User-Agent": "Mozilla/5.0" }
    }).then(r => r.text());

    const $$ = cheerio.load(iframeHTML);

    // STEP 4 → Extract video source from iframe
    const videoURL = $$("source").attr("src");

    if (!videoURL) {
      return res.status(404).json({ error: "Video not found in iframe" });
    }

    console.log("FINAL VIDEO URL:", videoURL);

    // Return JSON
    res.json({ video: videoURL });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Extractor failed" });
  }
});

app.get("/proxy", async (req, res) => {
  try {
    let videoURL = decodeURIComponent(req.query.url);

    const response = await fetch(videoURL, {
      headers: {
        "Referer": "https://viralkand.com/",
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      return res.status(response.status).send("Failed to stream");
    }

    res.setHeader("Content-Type", "video/mp4");

    const stream = Readable.fromWeb(response.body);
    stream.pipe(res);

  } catch (err) {
    console.error("PROXY ERROR:", err);
    res.status(500).send("Proxy failed");
  }
});

app.get("/proxy2", async (req, res) => {
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