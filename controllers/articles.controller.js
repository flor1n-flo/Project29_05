const { selectAllArticles } = require("../models/articles.model");

exports.getArticles = (request, response, next) => {
  selectAllArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};