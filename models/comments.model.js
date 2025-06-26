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

//fetch all comments for a specific article by ID
exports.selectCommentsByArticleId = (article_id) => {
  const queryStr= `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `;
  
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.removeCommentById = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};