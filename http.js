// node --env-file .env index.js
const { createServer } = require("node:http");
const articles = require("./utils/articles.json");
// import { readFile } from "node:fs";
// const { findAvailablePort } = require("./utils/free-port.js");

const port = process.env.PORT ?? 3000;

const processRequest = (req, res) => {
  const { method, url } = req;

  switch (method) {
    case "GET":
      switch (url) {
        case "/": {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          return res.end(JSON.stringify(articles));
        }
        default: {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.end("<h1>404</h1>");
        }
      }

    case "POST":
      switch (url) {
        case "/": {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", () => {
            const data = JSON.parse(body);
            res.writeHead(201, {
              "Content-Type": "application/json; charset=utf-8",
            });
            data.timestamp = Date.now();
            res.end(JSON.stringify(data));
          });

          break;
        }

        default: {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.end("<h1>404</h1>");
        }
      }
  }
};

// const processRequest = (req, res) => {
//   // res.statusCode = 200; // predeterminado
//   res.setHeader("Content-Type", "text/html; charset=utf-8");

//   if (req.url === "/") {
//     res.end("<h1>El Villanense</h1>");
//   } else if (req.url === "/logo") {
//     readFile("./logo.png", (err, data) => {
//       if (err) {
//         res.statusCode = 500;
//         res.end("<h1>500 Internal Server Error</h1>");
//       } else {
//         res.setHeader("Content-Type", "image/png");
//         res.end(data);
//       }
//     });
//   } else if (req.url === "/login") {
//     res.end("<h1>Login</h1>");
//   } else {
//     res.statusCode = 404;
//     res.end("<h1>Not Found</h1>");
//   }
// };

const server = createServer(processRequest);

// findAvailablePort(desiredPort).then((port) => {
//   server.listen(port, () => {
//     console.log(`server listening on port http://localhost:${port}`);
//   });
// });

server.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`);
});
