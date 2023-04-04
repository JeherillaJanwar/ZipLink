require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 8080;
const validUrl = require("valid-url");

// MongoDB
const mongoose = require("mongoose");
const MONGO_URL = process.env.mongo_url;
const MONGO_DATABASE = process.env.db;
const Url = require("./model/url.js");

// Swagger config
const yamlJS = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = yamlJS.load(path.join(__dirname + "/api/swagger.yaml"));
const apiBasePath = "/api";

// Logger
const Logs = require("./lib/logs");
const log = new Logs("server");

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGO_URL, { dbName: MONGO_DATABASE })
  .then(() => {
    function valid(url) {
      if (validUrl.isUri(url)) {
        return true;
      } else {
        return false;
      }
    }

    function uuid() {
      let d = new Date().getTime();
      if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
      ) {
        d += performance.now(); //use high-precision timer if available
      }
      const uuid = "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }

    async function generateUniqueAlias(collection, length) {
      let code = "";
      const characters =
        "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvqxyz0123456789-!";
      const codeLength = length; // adjust this to change the length of the code
      const totalPossibleCodes = Math.pow(characters.length, codeLength);
      let attempts = 0;

      while (attempts < totalPossibleCodes) {
        // generate a random code
        for (let i = 0; i < codeLength; i++) {
          code += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }

        // check if the code exists in the collection
        const result = await collection.findById(code);

        if (!result) {
          // code doesn't exist, return it
          return code;
        }

        attempts++;
      }

      // if all possible codes have been used, generate a new code by appending a random number to the end
      let newCode;
      let maxAttempts = 10; // set a limit to the number of attempts to prevent an infinite loop
      do {
        newCode = code + Math.floor(Math.random() * 10);
        const result = await collection.findById(newCode);
        if (!result) {
          return newCode;
        }
        maxAttempts--;
      } while (maxAttempts > 0);

      // if all appended numbers have been used, generate a new code by incrementing the last digit
      let lastDigit = parseInt(code[codeLength - 1], 36) || 0;
      if (lastDigit < 35) {
        // set a limit to the last digit to prevent overflow
        lastDigit++;
      } else {
        lastDigit = 0;
      }
      code = code.substr(0, codeLength - 1) + lastDigit.toString(36);
      const result = await collection.findById(code);
      if (!result) {
        return code;
      }

      // if all possible codes have been used, recursively call the function to generate a new code
      return generateUniqueAlias(collection);
    }

    function isValidAlias(alias) {
      // Check if the alias contains only valid URL characters
      return /^[a-zA-Z0-9\-_~.!]+$/.test(alias);
    }

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
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Set up the route to delete URLs
    app.delete("/short/delete", async (req, res) => {
      const { accessKey } = req.query;

      if (!accessKey) {
        res.status(403).json({ status: "Access Key is Not Provided!" });
      }

      try {
        const protocol = req.protocol;
        const host = req.get("host");
        const findOne = await Url.findOne({ accessKey: accessKey });
        const deleted_url = protocol + "://" + host + "/" + findOne._id;
        if (findOne) {
          await Url.deleteOne({ _id: findOne._id });
          return res
            .status(200)
            .json({ status: "Short URL deleted!", deleted_url: deleted_url });
        } else {
          return res.status(403).json({ status: "Access Key was Not Found!" });
        }
      } catch (err) {
        res.status(403).json({ status: err });
      }
    });

    // Set up the route for shortening URLs
    app.get("/shorten", async (req, res) => {
      const { url, alias, ip } = req.query;
      var random = await generateUniqueAlias(Url, 8);

      if (valid(url)) {
        if (!ip) {
          return res.status(403).json({ error: "No IP provided!" });
        } else {
          if (!alias) {
            // Create a new shortened URL
            let newUrl = new Url({
              _id: random,
              originalUrl: url,
              createdAt: when,
              ip: ip,
              accessKey: uuid(),
            });
            await newUrl.save();
            const protocol = req.protocol;
            const host = req.get("host");
            var short = protocol + "://" + host + "/" + newUrl._id;
            return res.send(
              JSON.stringify(
                {
                  shortened_url: short,
                  accessKey: newUrl.accessKey,
                  shortId: newUrl._id,
                },
                null,
                4
              )
            );
          } else {
            const aliasFindOne = await Url.findById(alias);
            if (!aliasFindOne) {
              if (isValidAlias(alias)) {
                // Create a new shortened URL
                let newAliasUrl = new Url({
                  originalUrl: url,
                  _id: alias,
                  createdAt: when,
                  ip: ip,
                  accessKey: uuid(),
                });
                await newAliasUrl.save();

                const protocol = req.protocol;
                const host = req.get("host");
                var short = protocol + "://" + host + "/" + newAliasUrl._id;
                return res.send(
                  JSON.stringify(
                    {
                      shortened_url: short,
                      accessKey: newAliasUrl.accessKey,
                      shortId: newAliasUrl._id,
                    },
                    null,
                    4
                  )
                );
              } else {
                return res.send(
                  JSON.stringify(
                    {
                      shortId: "Invalid Alias",
                    },
                    null,
                    4
                  )
                );
              }
            } else {
              return res.send(
                JSON.stringify(
                  {
                    shortId: "THIS alias isn't available",
                  },
                  null,
                  4
                )
              );
            }
          }
        }
      } else {
        return res.send("Invalid URL");
      }
    });

    app.get("/api/shorten", async (req, res) => {
      const protocol = req.protocol;
      const host = req.get("host");
      const { url, alias } = req.query;
      var random = await generateUniqueAlias(Url, 8);
      if (valid(url)) {
        if (!alias) {
          // Create a new shortened URL
          let newUrl = new Url({
            _id: random,
            originalUrl: url,
            createdAt: when,
            api: true,
            accessKey: uuid(),
          });
          await newUrl.save();
          var short = protocol + "://" + host + "/" + newUrl._id;
          res.setHeader("Content-Type", "application/json");
          res.send(
            JSON.stringify(
              {
                shortened_url: short,
                accessKey: newUrl.accessKey,
                shortId: newUrl._id,
              },
              null,
              4
            )
          );
        } else {
          // checks
          const aliasFindOne = await Url.findById(alias);

          if (!aliasFindOne) {
            if (isValidAlias(alias)) {
              // Create a new shortened URL
              let newAliasUrl = new Url({
                originalUrl: url,
                _id: alias,
                accessKey: uuid(),
                createdAt: when,
                api: true,
              });
              await newAliasUrl.save();
              var short = protocol + "://" + host + "/" + newAliasUrl._id;
              return res.send(
                JSON.stringify(
                  {
                    shortened_url: short,
                    accessKey: newAliasUrl.accessKey,
                    shortId: newAliasUrl._id,
                  },
                  null,
                  4
                )
              );
            } else {
              return res.send(
                JSON.stringify({ shortened_url: "Invalid Alias" }, null, 4)
              );
            }
          } else {
            res.setHeader("Content-Type", "application/json");
            res.send(
              JSON.stringify(
                { shortened_url: "THIS alias isn't available" },
                null,
                4
              )
            );
          }
        }
      } else {
        return res.send("Invalid URL");
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

    app.get(["*"], (req, res) => {
      res.sendFile(views.notFound);
    });

    // Start the server
    server.listen(port, null, () => {
      log.debug("Server Started on port " + port);
    });
  })
  .catch((err) => log.log(err));

mongoose.connection.on("connected", () => {
  log.debug("Mongoose connection open to:", {
    url: MONGO_URL,
    db: MONGO_DATABASE,
  });
});

mongoose.connection.on("error", (err) => {
  log.error("Mongoose connection error:", {
    error: err,
    url: MONGO_URL,
    db: MONGO_DATABASE,
  });
});

mongoose.connection.on("disconnected", () => {
  log.error("Mongoose connection disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.once("close", function () {
    log.error("Mongoose connection disconnected through app termination");
    process.exit(0);
  });
  mongoose.connection.close();
});
