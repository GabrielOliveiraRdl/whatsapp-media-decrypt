const express = require("express");
const fs = require("fs");
const decrypt = require("wa-decrypt-nodejs");

const app = express();
app.use(express.json({ limit: "50mb" }));

app.post("/decrypt", async (req, res) => {
  try {
    const { mediaKey, file } = req.body;

    if (!mediaKey || !file) {
      return res.status(400).json({ error: "mediaKey and file are required" });
    }

    const input = Buffer.from(file, "base64");
    const output = decrypt.decryptMedia(input, mediaKey, "document");

    res.setHeader("Content-Type", "text/csv");
    res.send(output);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_, res) => res.send("ok"));

app.listen(3000, () => console.log("Decrypt service running on port 3000"));
