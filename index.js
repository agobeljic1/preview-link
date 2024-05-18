const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const port = 3000;

app.post("/fetch-url-metadata", async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const metadata = {
      title:
        $('meta[property="og:title"]').attr("content") || $("title").text(),
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content"),
      image: $('meta[property="og:image"]').attr("content"),
    };
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: "Error fetching URL metadata" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
