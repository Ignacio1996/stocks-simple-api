const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const ejs = require('ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs')

require("dotenv").config();

const timePeriod = require("./constants");

/*
{
	"ticker": "TWOU",
	"type": "monthly"
}
*/

app.get('/', (req,res)=>{
  res.render('index')
})

app.post("/stock", async (req, res) => {
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
        res.json({ data: values, status: 'done' });
      }
    })
    .catch(error => {
      console.log("stocks-api.js 47 | error", error);
      res.json({ error: error });
    });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("index.js 6 | server started...");
});
