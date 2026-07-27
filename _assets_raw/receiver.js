// Helyi fogadó: a böngésző ide POST-olja a képek bájtjait, mi lemezre írjuk.
//
// FONTOS: a Chrome "Private Network Access" védelme blokkolja, ha egy publikus
// HTTPS oldal a helyi hálózatra kérne — ezért kell az
// Access-Control-Allow-Private-Network fejléc az OPTIONS előkérésre.
const http = require("http");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "gallery");
fs.mkdirSync(OUT, { recursive: true });

http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Private-Network", "true");
    res.setHeader("Access-Control-Max-Age", "86400");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    if (req.method === "POST") {
      const name = (new URL(req.url, "http://x").searchParams.get("name") || "img")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(path.join(OUT, name), buf);
        console.log("mentve:", name, buf.length, "bajt");
        res.writeHead(200);
        res.end("ok");
      });
      return;
    }
    res.writeHead(200);
    res.end("fogado fut");
  })
  .listen(7788, "127.0.0.1", () => console.log("fogado: 127.0.0.1:7788 ->", OUT));
