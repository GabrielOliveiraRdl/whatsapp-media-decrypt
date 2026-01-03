import express from "express";
import multer from "multer";
import baileys from "@whiskeysockets/baileys";

const { decryptMediaMessage } = baileys;

const app = express();
const upload = multer({ dest: "/tmp" });

app.post("/decrypt", upload.single("file"), async (req, res) => {
  try {
    if (!req.file || !req.body.message) {
      return res.status(400).json({ error: "file ou message ausente" });
    }

    const message = JSON.parse(req.body.message);

    const buffer = await decryptMediaMessage(
      message,
      "buffer",
      {}
    );

    res.setHeader(
      "Content-Type",
      message.mimetype || "application/octet-stream"
    );

    res.send(buffer);
  } catch (err) {
    console.error("DECRYPT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_, res) => res.send("ok"));

app.listen(3000, () => {
  console.log("Decrypt service running on port 3000");
});
