const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const ejs = require("ejs");

const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

require("dotenv").config();

const timePeriod = require("./constants");

const cron = require("cron");

// var cronJob = cron.job("*/30 * * * * *", () => {
//   // perform operation e.g. GET request http.get() etc.
//   console.info("cron job completed");
// });
// cronJob.start();

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/stock", cors(), async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));
  const { ticker, type } = body;
  console.log("stocks-api.js 14 | body", body.ticker);
  const request = await fetch(
    `https://www.alphavantage.co/query?function=${timePeriod(
      type
    )}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
  );
  const data = await request.json();
  res.json({ data: data });
});

app.post("/stocks", async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));
  const { tickers, type } = body;
  console.log("stocks-api.js 14 | body", body.tickers);
  let stocks = await tickers.map(async ticker => {
    const request = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const data = await request.json();
    return data;
  });

  Promise.all(stocks)
    .then(values => {
      console.log("stocks-api.js 40 | values", values);
      if (values[0].Note) {
        console.log("stocks-api.js 48 | error", values[0].Note);
        res.json({ error: values[0].Note });
      } else {
        res.json({ data: values, status: "done" });
      }
    })
    .catch(error => {
      console.log("stocks-api.js 47 | error", error);
      res.json({ error: error });
    });
});

app.post("/stocks-unlimited", async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));
  const { tickers, type } = body;
  console.log("stocks-api 74 | tickers length", tickers.length);
  let stocksArray = [];
  console.log("stocks-api.js 14 | body", body.tickers);
  await tickers.forEach(async (ticker, index) => {
    setTimeout(async () => {
      const request = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      );
      const data = await request.json();
      console.log("stocks-api 82 | data", Object.values(data)[0]);
      stocksArray.push(Object.values(data)[0]);
      console.log("stocks-api 84 | stocks array", stocksArray);
      if (stocksArray.length === tickers.length) {
        res.json({ tickers: stocksArray });
      }
    }, index * 12000);
  });

  // setTimeout(async () => {
  //   res.json({
  //     tickers: stocksArray,
  //   })
  // }, 12000 * tickers.length);

  // Promise.all(stocks)
  //   .then(values => {
  //     console.log("stocks-api.js 40 | values", values);
  //     if (values[0].Note) {
  //       console.log("stocks-api.js 48 | error", values[0].Note);
  //       res.json({ error: values[0].Note });
  //     } else {
  //       res.json({ data: values, status: "done" });
  //     }
  //   })
  //   .catch(error => {
  //     console.log("stocks-api.js 47 | error", error);
  //     res.json({ error: error });
  //   });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("index.js 6 | server started...");
});
