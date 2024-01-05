const express = require("express");
const cors = require("cors");
const articles = require("./lib/articles.json");
const { getFriendlyUrl } = require("./lib/utils.js");
const {
  validateArticle,
  validatePartialArticle,
} = require("./schemas/articles.js");

const app = express();

app.disable("x-powered-by");

// app.use((req, res, next) => {
//   if (req.method !== "POST") return next();
//   if (req.headers["content-type"] !== "application/json") return next();

//   let body = "";

//   req.on("data", (chunk) => {
//     body += chunk.toString();
//   });

//   req.on("end", () => {
//     const data = JSON.parse(body);
//     data.timestamp = Date.now();
//     req.body = data;
//     next();
//   });
// });

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.get("/api/articles", (req, res) => {
  // const origin = req.header("origin");
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }

  const { section } = req.query;
  if (section) {
    const filteredArticles = articles.filter(
      (article) => article.section === section,
    );
    return res.json(filteredArticles);
  }
  return res.json(articles);
});

app.post("/api/articles", (req, res) => {
  const result = validateArticle(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const friendlyUrl = getFriendlyUrl(result.data.title);
  const timestamp = Date.now();

  const newArticle = {
    id: friendlyUrl + "-" + timestamp,
    ...result.data,
    timestamp,
  };

  articles.push(newArticle);

  res.status(201).json(newArticle);
});

app.get("/api/articles/:id", (req, res) => {
  const { id } = req.params;
  const article = articles.find((article) => article.id === id);
  if (article) return res.json(article);
  res.status(404).json({ message: "Article not found" });
});

app.patch("/api/articles/:id", (req, res) => {
  const result = validatePartialArticle(req.body);

  if (!result.success) {
    return res.status(400).json({ message: result.error.message });
  }

  const { id } = req.params;
  const articleIndex = articles.findIndex((article) => article.id === id);

  if (articleIndex === -1) {
    return res.status(404).json({ message: "Article not found" });
  }

  const updatedArticle = {
    ...articles[articleIndex],
    ...result.data,
  };

  articles[articleIndex] = updatedArticle;

  return res.json(updatedArticle);
});

app.delete("/api/articles/:id", (req, res) => {
  // const origin = req.header("origin");
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header("Access-Control-Allow-Origin", origin);
  // }

  const { id } = req.params;
  const articleIndex = articles.findIndex((article) => article.id === id);

  if (articleIndex === -1) {
    return res.status(404).json({ message: "Article not found" });
  }

  articles.splice(articleIndex, 1);

  return res.json({ message: "Article deleted" });
});

// app.options("/api/articles/:id", (req, res) => {
//   const origin = req.header("origin");
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Methods", "PUT, PATCH, DELETE");
//   }

//   res.sendStatus(200);
// });

app.use((req, res) => {
  res.status(404).send("<h1>404</h1>");
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
