import express from "express";
import fs from "fs";
import { createServer } from "http";
import fetch from "node-fetch"; 

const app = express();

app.get("/concat", async (req, res) => {
  try {
    const audio1Response = await fetch(req.query.audio1, {
      redirect: "follow",
    });
    const audio2Response = await fetch(req.query.audio2, {
      redirect: "follow",
    });

    if (!audio1Response.ok || !audio2Response.ok) {
      throw new Error("Failed to fetch audio files");
    }

    const buffer1 = Buffer.from(await audio1Response.arrayBuffer());
    const buffer2 = Buffer.from(await audio2Response.arrayBuffer());

    const concatenatedBuffer = Buffer.concat([buffer1, buffer2]);

    const filename = `${Date.now()}.ogg`;
    fs.writeFileSync(
      `./public/${filename}`,
      concatenatedBuffer,
      "binary",
      (err) => {
        if (err) {
          throw new Error("Error creating audio file:", err);
        }
        console.log("File created:", `./public/${filename}`);
      }
    );

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="./${filename}"`
    );
    res.download(`./public/${filename}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing audio files");
  }
});

createServer(app).listen(process.env.PORT || 3000);
