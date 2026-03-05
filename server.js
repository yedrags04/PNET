const server = Bun.serve({
  routes: {
    "/": () => Response.redirect("/index.html"),
    "/*": req => {
      const url = new URL(req.url);
      const pathname= decodeURIComponent(url.pathname);
      const file = Bun.file(`${import.meta.dir}/src${pathname}`);
      console.log(`GET ${pathname}`)
      return new Response(file);
    }
  },
});

console.log(`Serving in ${server.url}`);
