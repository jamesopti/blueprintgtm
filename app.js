const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const basePath = "https://gamma-ahig3gpbv-gamma-app.vercel.app"

const url = require('url');
const proxy = require('express-http-proxy');

const resourceProxy = proxy(basePath, {
    proxyReqPathResolver: req => url.parse(req.baseUrl).path
});

const baseProxy = proxy(basePath, {
  proxyReqPathResolver: req => "/published/srdcvjfw933pv12"
});

app.get('/', baseProxy);
app.get("*", resourceProxy);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

