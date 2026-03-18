const srcDir = `${import.meta.dir}/src`;
const watchPattern = "src/**/*.{html,css,js}";
const pollIntervalMs = 200;
const liveReloadClients = new Set();
const encoder = new TextEncoder();

let server;

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
    for (const controller of liveReloadClients) {
        try {
            controller.enqueue(encoder.encode(`event: reload\ndata: ${changedFile}\n\n`));
        } catch {
            liveReloadClients.delete(controller);
        }
    }
}

function createFetch() {
    return async (req) => {
        const url = new URL(req.url);
        const pathname = decodeURIComponent(url.pathname);

        if (pathname === "/") {
            return Response.redirect("/index.html");
        }

        if (pathname === "/__live-reload") {
            let clientController;
            const stream = new ReadableStream({
                start(controller) {
                    clientController = controller;
                    liveReloadClients.add(controller);
                    controller.enqueue(encoder.encode("retry: 1000\n\n"));

                    req.signal.addEventListener(
                        "abort",
                        () => {
                            liveReloadClients.delete(controller);
                            try {
                                controller.close();
                            } catch {}
                        },
                        { once: true },
                    );
                },
                cancel() {
                    if (clientController) {
                        liveReloadClients.delete(clientController);
                    }
                },
            });

            return new Response(stream, {
                headers: {
                    "Content-Type": "text/event-stream; charset=utf-8",
                    "Cache-Control": "no-cache, no-transform",
                    Connection: "keep-alive",
                },
            });
        }

        const file = Bun.file(`${srcDir}${pathname}`);
        if (!(await file.exists())) {
            return new Response("Not found", { status: 404 });
        }

        if (pathname.endsWith(".html")) {
            return new Response(injectLiveReload(await file.text()), {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                    "Cache-Control": "no-cache",
                },
            });
        }

        return new Response(file);
    };
}

async function snapshotWatchedFiles() {
    const files = new Map();
    const glob = new Bun.Glob(watchPattern);

    for await (const relativePath of glob.scan({ cwd: import.meta.dir })) {
        files.set(relativePath, Bun.file(`${import.meta.dir}/${relativePath}`).lastModified);
    }

    return files;
}

async function watchFiles() {
    let previous = await snapshotWatchedFiles();

    while (true) {
        await Bun.sleep(pollIntervalMs);
        const current = await snapshotWatchedFiles();

        let changedFile;
        for (const [path, modifiedAt] of current) {
            if (previous.get(path) !== modifiedAt) {
                changedFile = path;
                break;
            }
        }

        if (!changedFile) {
            for (const path of previous.keys()) {
                if (!current.has(path)) {
                    changedFile = path;
                    break;
                }
            }
        }

        if (changedFile) {
            server.reload({ fetch: createFetch() });
            notifyReload(changedFile);
            console.log(`[reload] ${changedFile}`);
        }

        previous = current;
    }
}

server = Bun.serve({
    fetch: createFetch(),
});

watchFiles();

console.log(`Serving in ${server.url}`);
console.log("Live reload enabled for .html, .css and .js in src/");
