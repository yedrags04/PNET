import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, "src");
const watchExtensions = new Set([".html", ".css", ".js"]);
const pollIntervalMs = 200;
const liveReloadClients = new Set();
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "localhost";

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8",
};

const liveReloadScript = `<script>
window.addEventListener("load", () => {
  const source = new EventSource("/__live-reload");
  source.addEventListener("reload", () => location.reload());
  const close = () => source.close();
  window.addEventListener("pagehide", close, { once: true });
  window.addEventListener("beforeunload", close, { once: true });
});
</script>`;

function injectLiveReload(html) {
    if (html.includes("/__live-reload")) {
        return html;
    }

    if (html.includes("</body>")) {
        return html.replace("</body>", `${liveReloadScript}</body>`);
    }

    return `${html}${liveReloadScript}`;
}

function notifyReload(changedFile) {
    const message = `event: reload\ndata: ${changedFile}\n\n`;

    for (const res of liveReloadClients) {
        try {
            res.write(message);
        } catch {
            liveReloadClients.delete(res);
        }
    }
}

async function getWatchedFiles(dir = srcDir, base = "src") {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = `${base}/${entry.name}`;

        if (entry.isDirectory()) {
            files.push(...(await getWatchedFiles(fullPath, relativePath)));
            continue;
        }

        if (watchExtensions.has(path.extname(entry.name))) {
            files.push({ fullPath, relativePath });
        }
    }

    return files;
}

async function snapshotWatchedFiles() {
    const snapshot = new Map();
    const files = await getWatchedFiles();

    for (const file of files) {
        const stats = await fs.stat(file.fullPath);
        snapshot.set(file.relativePath, stats.mtimeMs);
    }

    return snapshot;
}

async function watchFiles() {
    let previous = await snapshotWatchedFiles();

    while (true) {
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
        const current = await snapshotWatchedFiles();

        let changedFile;
        for (const [filePath, modifiedAt] of current) {
            if (previous.get(filePath) !== modifiedAt) {
                changedFile = filePath;
                break;
            }
        }

        if (!changedFile) {
            for (const filePath of previous.keys()) {
                if (!current.has(filePath)) {
                    changedFile = filePath;
                    break;
                }
            }
        }

        if (changedFile) {
            notifyReload(changedFile);
            console.log(`[reload] ${changedFile}`);
        }

        previous = current;
    }
}

function getContentType(filePath) {
    return mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

async function handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host || `${host}:${port}`}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === "/") {
        res.writeHead(302, { Location: "/index.html" });
        res.end();
        return;
    }

    if (pathname === "/__live-reload") {
        res.writeHead(200, {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        });
        res.write("retry: 1000\n\n");
        liveReloadClients.add(res);

        req.on("close", () => {
            liveReloadClients.delete(res);
        });

        return;
    }

    const relativeFilePath = pathname.replace(/^\/+/, "");
    const absolutePath = path.resolve(srcDir, relativeFilePath);

    if (!absolutePath.startsWith(srcDir)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
    }

    let stats;
    try {
        stats = await fs.stat(absolutePath);
    } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
    }

    if (!stats.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
    }

    const contentType = getContentType(absolutePath);

    if (absolutePath.endsWith(".html")) {
        const html = await fs.readFile(absolutePath, "utf8");
        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache",
        });
        res.end(injectLiveReload(html));
        return;
    }

    const content = await fs.readFile(absolutePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
}

const server = createServer((req, res) => {
    handleRequest(req, res).catch((error) => {
        console.error(error);
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Internal server error");
    });
});

server.listen(port, host, () => {
    console.log(`Serving in http://${host}:${port}`);
    console.log("Live reload enabled for .html, .css and .js in src/");
});

watchFiles().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
