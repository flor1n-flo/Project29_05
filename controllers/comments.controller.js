const { insertCommentByArticleId } = require("../models/comments.model");
const { removeCommentById } = require("../models/comments.model");
const { selectCommentsByArticleId } = require("../models/comments.model");
const { checkIfArticleExists } = require("../models/articles.model");


exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};


//controller to get all comments for a specific article
exports.getCommentsByArticleId = (req, res, next) => {
  const {article_id} = req.params;

  //valdiation if article_id is a number
  if (isNaN(article_id)) {
    return next( {status: 400, msg: "Invalid article ID" });
  }

  Promise.all([
    checkIfArticleExists(article_id),
    selectCommentsByArticleId(article_id)
  ])
    .then(([_, comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};