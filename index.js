const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config();

/*
{
	"ticker": "TWOU",
	"type": "monthly"
}
*/

app.post("/stock", async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));
  const { ticker, type } = body;
  console.log("stocks-api.js 14 | body", body.ticker);
  const request = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
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

  Promise.all(stocks).then(values=>console.log('stocks-api.js 40 | values', values))

  res.json({ data: data });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("index.js 6 | server started...");
});
