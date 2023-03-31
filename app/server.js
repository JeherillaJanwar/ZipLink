require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const MONGO_URL = process.env.mongo_url;
const MONGO_DATABASE = process.env.db;
const http = require("http");
const server = http.createServer(app);
const port = 8080;

function code(x) {
  let code = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < x; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return code;
}

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGO_URL, { dbName: MONGO_DATABASE })
  .then(() => {
    const now = new Date();
    const when = now.toUTCString();

    const dir = {
      public: path.join(__dirname, "../", "public"),
    };
    const views = {
      index: path.join(__dirname, "../", "public/views/index.html"),
      notFound: path.join(__dirname, "../", "public/views/404.html"),
    };

    app.use(express.static(dir.public));
    // Create a schema for URLs
    const urlSchema = new mongoose.Schema({
      _id: { type: String, default: code(8) },
      originalUrl: { type: String },
      createdAt: { type: String },
      ip: { type: String },
    });

    // Create a model for URLs using the schema
    const Url = mongoose.model("Url", urlSchema);

    // Set up the route for shortening URLs
    app.get("/shorten", async (req, res) => {
      const { url, alias, ip } = req.query;
      if (!alias) {
        // Create a new shortened URL
        let newUrl = new Url({ originalUrl: url, createdAt: when, ip: ip });
        await newUrl.save();
        return res.send(newUrl._id);
      } else {
        // Create a new shortened URL
        let newAliasUrl = new Url({
          originalUrl: url,
          _id: alias,
          createdAt: when,
          ip: ip,
        });
        await newAliasUrl.save();
        return res.send(newAliasUrl._id);
      }
    });

    app.get("/:id", async (req, res) => {
      const { id } = req.params;

      // Look up the original URL based on the shortened ID
      let url = await Url.findById(id);

      if (url) {
        // Redirect to the original URL
        return res.redirect(url.originalUrl);
      } else {
        return res.sendFile(views.notFound);
      }
    });

    app.get(["/"], (req, res) => {
      res.sendFile(views.index);
    });

    // Start the server
    server.listen(port, null, () => {
      console.log("Server Started on port " + port);
    });
  })
  .catch((err) => console.log(err));

mongoose.connection.on("connected", () => {
  console.debug("Mongoose connection open to:", {
    url: MONGO_URL,
    db: MONGO_DATABASE,
  });
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", {
    error: err,
    url: MONGO_URL,
    db: MONGO_DATABASE,
  });
});

mongoose.connection.on("disconnected", () => {
  console.error("Mongoose connection disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.once("close", function () {
    console.error("Mongoose connection disconnected through app termination");
    process.exit(0);
  });
  mongoose.connection.close();
});
