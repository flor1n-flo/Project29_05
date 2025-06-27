const db = require("../connection")
const format = require("pg-format");
const {
  convertTimestampToDate,
  createArticleRef,
  formatComments,
} = require ("./utils")

const seed = async ({ topicData, userData, articleData, commentData }) => {
  //return db.query();//<< write your first query in here.
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  //creating tables

  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR NOT NULL,
      img_url VARCHAR(1000)
      );
    `);

  await db.query(`
    CREATE TABLE users (
     username VARCHAR PRIMARY KEY,
     name VARCHAR NOT NULL,
     avatar_url VARCHAR(1000)
    );
  `);

  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      topic VARCHAR REFERENCES topics(slug) NOT NULL,
      author VARCHAR REFERENCES users(username) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    );
  `);

  await db.query (`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR REFERENCES users(username) NOT NULL,
      article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
    );
  `);


  //Insert in topics
  const topicInsertQueryStr = format(
    `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
    topicData.map(({ slug, description, img_url }) => [slug, description, img_url])
  );
  await db.query(topicInsertQueryStr);
  

  //Insert in users
  const userInsertQueryStr = format(
    `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
    userData.map(({ username, name, avatar_url }) => [username, name, avatar_url])
  );
  await db.query(userInsertQueryStr);


  //convert the articel timestamp
  const formattedArticles = articleData.map(convertTimestampToDate);

  //Insert in articles
  const articleInsertQueryStr = format(
    `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
    formattedArticles.map(({title, topic, author, body, created_at, votes, article_img_url}) => 
      [title, topic, author, body, created_at, votes, article_img_url])
  );
  const insertedArticles = await db.query(articleInsertQueryStr);

  //create article reference map
  const articleRef = createArticleRef(insertedArticles.rows);

  
  //format and insert comments 
  const formattedComments = formatComments(commentData, articleRef);

  //isnert in comments
  const commentInsertQueryStr = format(
    `INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L RETURNING *;`,
    formattedComments.map(({ author, article_id, votes, created_at, body }) => [author, article_id, votes, created_at, body])
  );
  await db.query(commentInsertQueryStr);

};
module.exports = seed;
