import express from "express";
import multer from "multer";
import fs from "fs";
import { createServer } from "http";

const upload = multer();
const app = express();

app.post("/concat", upload.any(), async (req, res) => {
  const buffer1 = req?.files[0].buffer;
  const buffer2 = req?.files[1].buffer;
  const concatenatedBuffer = Buffer.concat([buffer1, buffer2]);

  const outputFile = "audio.mp3";

  fs.writeFileSync(outputFile, concatenatedBuffer, "binary", (err) => {
    if (err) {
      console.error("error to make audio file:", err);
    } else {
      console.log("File created:", outputFile);
    }
  });
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Disposition", 'attachment; filename="./audio.mp3"');
  res.download("audio.mp3");
});

createServer(app).listen(process.env.PORT);
