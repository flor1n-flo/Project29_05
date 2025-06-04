const express = require("express");
const app = express();
const fs = require("fs/promises"); // for reading endpoints.json
const { getTopics } = require("./controllers/topics.controller");
const { getArticles } = require("./controllers/articles.controller");

app.use(express.json());

// get /api route

app.get("/api", async (request, response, next) => {
    try {
        const endpoints = await fs.readFile("./endpoints.json", "utf-8");
        response.status(200).send({ endpoints: JSON.parse(endpoints) });
    }
    catch (err) {
        next(err);
    }
});

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

module.exports = app;