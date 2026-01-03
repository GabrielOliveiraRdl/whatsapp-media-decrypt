import express from "express";
import multer from "multer";
import pkg from "@whiskeysockets/baileys";

const { makeWASocket, downloadMediaMessage } = pkg;

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// socket fake (não conecta no WhatsApp)
const sock = makeWASocket({
  auth: {},
  printQRInTerminal: false,
});

app.post("/decrypt", upload.single("file"), async (req, res) => {
  try {
    if (!req.body.message) {
      return res.status(400).json({ error: "message ausente" });
    }

    const message = JSON.parse(req.body.message);

    const buffer = await downloadMediaMessage(
      message,
      "buffer",
      {},
      { logger: undefined }
    );

    res.setHeader(
      "Content-Type",
      message.message?.documentMessage?.mimetype ||
        "application/octet-stream"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_, res) => res.send("ok"));

app.listen(3000, () => {
  console.log("Decrypt service running on port 3000");
});
