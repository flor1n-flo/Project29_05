const db = require("../db/connection");

exports.insertCommentByArticleId = (article_id, username, body) => {
  if (!body || !username) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }

  const query = `
    INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  return db.query(query, [body, username, article_id]).then((result) => {
    return result.rows[0];
  });
};