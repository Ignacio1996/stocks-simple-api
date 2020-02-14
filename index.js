const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const cors = require("cors");
app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config();

const timePeriod = require("./constants");

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

app.post("/stocks", async (req, res) => { //less than 5 stocks per minute
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

app.post("/stocks-unlimited", async (req, res) => {//unlimited stocks in 12 seconds X number of tickers (i.e 10 tickers = 120 seconds to get data.)
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
      stocksArray.push(Object.values(data));
      console.log("stocks-api 84 | stocks array", stocksArray);
      if (stocksArray.length === tickers.length) {
        res.json({ tickers: stocksArray});
      }
    }, index * 12000);
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("index.js 6 | server started...");
});
