const cheerio = require('cheerio');
const express = require("express");
const https = require('https');
const proxy = require('express-http-proxy');
const port = process.env.PORT || 3001;

const app = express();
const basePath = "https://gamma-ahig3gpbv-gamma-app.vercel.app"

const opts = {};

if (!process.env.PORT) {
  const fs = require('fs');
  const key = fs.readFileSync('../../gamma/certificates/localhost-key.pem');
  const cert = fs.readFileSync('../../gamma/certificates/localhost.pem');
  opts.cert = cert;
  opts.key = key;
}


const server = https.createServer(opts, app);

app.set('etag', false)
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next()
})


// https://gamma-ahig3gpbv-gamma-app.vercel.app/published/srdcvjfw933pv12
// https://gamma.app/embed/Your-B2B-Leads-Dont-Reply-Now-What-srdcvjfw933pv12

const resourceProxy = proxy(basePath, {
  memoizeHost: false,
  proxyReqPathResolver: req => {
    return req.url
  }
});

const baseProxy = proxy(basePath, {
  memoizeHost: false,
  proxyReqPathResolver: req => "/published/srdcvjfw933pv12",
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // you can update headers
    // proxyReqOpts.headers['Content-Type'] = 'text/html';
    // proxyReqOpts.headers['upgrade-insecure-requests'] = '0';
    // console.log(proxyReqOpts.headers)
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    const $ = cheerio.load(proxyResData.toString('utf8'));
    // console.log($.html());
    $('head').prepend(`<base href="${basePath}">`);
    return $.html();
  }
});

app.get('/', baseProxy);
app.get("*", resourceProxy);

server.listen(port, () => console.log(`Example app listening on port ${port}!`));

