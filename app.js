const cheerio = require('cheerio');
const fs = require('fs');
const express = require("express");
const https = require('https');
const proxy = require('express-http-proxy');
const port = process.env.PORT || 3001;


// TEST DOC https://gamma-cdx8ch7ft-gamma-app.vercel.app/published/df3lyebptj85svu
const basePath = "https://gamma-cdx8ch7ft-gamma-app.vercel.app";
const publishedDocPath = "/published/df3lyebptj85svu";

// https://gamma-ahig3gpbv-gamma-app.vercel.app/published/srdcvjfw933pv12
// https://gamma.app/published/srdcvjfw933pv12
// const basePath = "https://gamma-ahig3gpbv-gamma-app.vercel.app"
// const publishedDocPath = "/published/srdcvjfw933pv12";






const app = express();
app.set('etag', false)
app.use((req, res, next) => {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next()
})


const resourceProxy = proxy(basePath, {
  memoizeHost: false,
  proxyReqPathResolver: req => {
    return req.url
  }
});

const baseProxy = proxy(basePath, {
  memoizeHost: false,
  proxyReqPathResolver: req => publishedDocPath,
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





