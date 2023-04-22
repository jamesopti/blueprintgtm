const cheerio = require('cheerio');
const fs = require('fs');
const express = require("express");
const https = require('https');
const proxy = require('express-http-proxy');
const port = process.env.PORT || 3001;

const app = express();
const basePath = "https://gamma-ahig3gpbv-gamma-app.vercel.app"

app.set('etag', false)
app.use((req, res, next) => {
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
  // userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
  //   console.log('Inserting base tag')
  //   const $ = cheerio.load(proxyResData.toString('utf8'));
  //   // console.log($.html());
  //   $('head').prepend(`<base href="${basePath}">`);
  //   return $.html();
  // }
});

app.get('/', baseProxy);
app.get("*", resourceProxy);



if (!process.env.PORT) {
  const opts = {
    key: fs.readFileSync('../../gamma/certificates/localhost-key.pem'),
    cert: fs.readFileSync('../../gamma/certificates/localhost.pem')
  };
  const server = https.createServer(opts, app);
  server.listen(port, () => console.log(`Example app listening on port ${port}!`));
} else {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}





