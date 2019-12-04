# Simple Stocks API made with Node

Node.js API for get stocks data.
Limited to 5 requests per minute.
Working with the Alphavantage API free version.

# Very limited functionality for now, created this in 1 hour so far

If you get CORS issues, just plug in https://cors-anywhere.herokuapp.com/ before the fetch url

const request = await fetch('https://cors-anywhere.herokuapp.com/https://stocksapi.herokuapp.com/stock' ...  // code below

Sample single stock request:
```
const getStock = async ticker =>{
  console.log("Getting data");
  const request = await fetch('https://stocksapi.herokuapp.com/stock',{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      'ticker': ticker,
      'type': 'daily'
    })
  })

  const data = await request.json()
  console.log(data);
  return data;
}

getStock('AAPL');
```

Sample multiple stocks request (with cors-anywhere to avoid CORS issues):

```
const getStocks = async tickersArray=>{
  console.log("Getting data");
  const request = await fetch('https://cors-anywhere.herokuapp.com/https://stocksapi.herokuapp.com/stocks',{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      'tickers': tickersArray,
      'type': 'daily'
    })
  })

  const data = await request.json()
  console.log(data);
  return data;
}

getStocks(['AAPL', 'MSFT', 'DIA']);
```



