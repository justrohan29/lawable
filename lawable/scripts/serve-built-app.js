const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "::";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`)
        ? "public, max-age=31536000, immutable"
        : "no-store",
    });
    response.end(data);
  });
}

function safeJoin(base, requestPath) {
  const normalized = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(base, normalized);
  return filePath.startsWith(base) ? filePath : null;
}

function routeToHtml(urlPath) {
  const cleanPath = urlPath.replace(/\/+$/, "") || "/";
  if (cleanPath === "/") return path.join(root, ".next", "server", "app", "index.html");

  const routePath = cleanPath.slice(1).replace(/\//g, path.sep);
  return path.join(root, ".next", "server", "app", `${routePath}.html`);
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", `http://localhost:${port}`);
  const pathname = url.pathname;

  if (pathname.startsWith("/_next/static/")) {
    const filePath = safeJoin(path.join(root, ".next", "static"), pathname.replace("/_next/static/", ""));
    if (!filePath) {
      response.writeHead(400);
      response.end("Bad request");
      return;
    }
    sendFile(response, filePath);
    return;
  }

  const publicPath = safeJoin(path.join(root, "public"), pathname.slice(1));
  if (publicPath && fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    sendFile(response, publicPath);
    return;
  }

  sendFile(response, routeToHtml(pathname));
});

server.listen(port, host, () => {
  console.log(`Serving built Lawable app at http://localhost:${port}`);
});
