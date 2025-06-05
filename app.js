const express = require("express");
const app = express();
const fs = require("fs/promises"); // for reading endpoints.json
const {handleCustomErrors, handlePsqlErrors,handleServerErrors} = require("./errors/handleErrors");


const { getTopics } = require("./controllers/topics.controller");
const { getArticles } = require("./controllers/articles.controller");
const { getAllUsers } =require("./controllers/users.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { postCommentByArticleId } = require("./controllers/comments.controller");


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
app.get("/api/users", getAllUsers);
app.get("/api/articles/:article_id", getArticleById);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);


//errors import
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;