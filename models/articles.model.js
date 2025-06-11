const db = require("../db/connection");

// get articles
// exports.selectAllArticles = () => {
//     const query = `
//      SELECT
//       articles.author,
//       articles.title,
//       articles.article_id,
//       articles.topic,
//       articles.created_at,
//       articles.votes,
//       articles.article_img_url,
//       COUNT(comments.comment_id)::INT AS comment_count
//      FROM articles
//      LEFT JOIN comments ON comments.article_id = articles.article_id
//      GROUP BY articles.article_id
//      ORDER BY articles.created_at DESC;
//     `;

//     return db.query(query).then((result) => {
//         return result.rows;
//     });
// };
exports.selectAllArticles = (sort_by = "created_at", order = "desc") => {
  const validSortColumns = ["article_id", "title", "topic", "author", "created_at", "votes", "comment_count"];
  const validOrder = ["asc", "desc"];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryStr = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

// get articles by ID
exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  return db
    .query(
      `UPDATE articles
       SET votes = votes + $1
       WHERE article_id = $2
       RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};