const UAParser = require('ua-parser-js');
const cheerio = require('cheerio');
const fs = require('fs');
const express = require("express");
const https = require('https');
const proxy = require('express-http-proxy');
const port = process.env.PORT || 3001;

// STAGING JORDANS DOC with card layouts: https://gamma-o7p3zxvjp-gamma-app.vercel.app/published/h99feggmjbq1ljl
const basePath = "https://gamma-o7p3zxvjp-gamma-app.vercel.app"
const publishedDocPath = "/published/h99feggmjbq1ljl";
const publishedDocPathMobile = "/published_mobile/h99feggmjbq1ljl";

// STAGING COPY OF JORDANS DOC https://gamma-o7p3zxvjp-gamma-app.vercel.app/published/6veodwb3uxwijkk
// const basePath = "https://gamma-o7p3zxvjp-gamma-app.vercel.app"
// const publishedDocPath = "/published/6veodwb3uxwijkk";
// const publishedDocPathMobile = "/published_mobile/6veodwb3uxwijkk";

// NEXT13.3 DOC https://gamma-3sgqa6bhz-gamma-app.vercel.app/published/cr3hu3hvm5vlk52
// const basePath = "https://gamma-o7p3zxvjp-gamma-app.vercel.app"
// const publishedDocPath = "/published/cr3hu3hvm5vlk52";
// const publishedDocPathMobile = "/published_mobile/cr3hu3hvm5vlk52";

// TEST DOC https://gamma-b25f2p2us-gamma-app.vercel.app/published/df3lyebptj85svu
// const basePath = "https://gamma-cdx8ch7ft-gamma-app.vercel.app";
// const publishedDocPath = "/published/df3lyebptj85svu";

// https://gamma-ahig3gpbv-gamma-app.vercel.app/published/srdcvjfw933pv12
// https://gamma.app/published/srdcvjfw933pv12
// const basePath = "https://gamma-ahig3gpbv-gamma-app.vercel.app"
// const publishedDocPath = "/published/srdcvjfw933pv12";
// const publishedDocPathMobile = "/published_mobile/srdcvjfw933pv12";


const app = express();
// app.set('etag', false)
// app.use((req, res, next) => {
//   res.setHeader('Surrogate-Control', 'no-store');
//   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//   res.setHeader('Pragma', 'no-cache');
//   res.setHeader('Expires', '0');
//   next()
// })


const resourceProxy = proxy(basePath, {
  proxyReqPathResolver: req => {
    return req.url
  }
});

const baseProxy = proxy(basePath, {
  proxyReqPathResolver: req => {
    const parser = new UAParser(req.headers['user-agent']);
    const isMobile = parser.getDevice().type === 'mobile'
    // console.log('ROOT REQUEST. IS MOBILE: ', isMobile)

    return publishedDocPath;
  },
  // userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
  //   console.log('Inserting base tag')
  //   const $ = cheerio.load(proxyResData.toString('utf8'));
  //   $('head').prepend(`<base href="${basePath}">`);
  //   return $.html();
  // }
});

app.get('/', baseProxy);
// app.get('/published/*', baseProxy);
// app.get('/_next/*/*.js', (req, res, next) => {
//   res.type('.js');
//   res.send("/* EMPTY */");
// });
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

